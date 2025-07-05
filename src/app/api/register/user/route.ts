import { connectToDatabase } from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
import { VerificationEmail } from "@/emails/VerificationEmail";
import { userRegisterSchema } from "@/schemas/backend/user";
import { z } from "zod";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = userRegisterSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid input data",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { firstname, lastname, email, password, contact } = validation.data;
    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists." },
        { status: 409 }
      );
    }
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const newUser = new User({
      firstname,
      lastname,
      email,
      password,
      contact: contact || undefined,
      userType: "User",
      verificationToken,
      verificationTokenExpires,
      isVerified: false, // Explicitly set to false
    });

    await newUser.save();

    try {
      const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}&type=user`;
      const from = process.env.EMAIL_FROM!;
      await resend.emails.send({
        from: from,
        to: email,
        subject: `Welcome to Project D1, ${firstname}!`,
        // Pass the user's first name to the component
        react: VerificationEmail({
          verificationLink,
          username: firstname,
        }),
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      return NextResponse.json(
        { message: "User registered, but failed to send verification email." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message:
          "User registered successfully. Please check your email to verify your account.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }
    console.error("User Registration Error:", error);
    return NextResponse.json(
      {
        message: "An error occurred during registration.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
