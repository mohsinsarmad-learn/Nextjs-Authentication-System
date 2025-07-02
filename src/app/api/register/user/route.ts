// src/app/api/register/user/route.ts
import { connectToDatabase } from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
import { VerificationEmail } from "@/emails/VerificationEmail"; // Import your email template

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  await connectToDatabase();
  try {
    const { firstname, lastname, email, password, contact } =
      await request.json();

    if (!firstname || !lastname || !email || !password) {
      return NextResponse.json(
        { message: "All required fields must be provided." },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists." },
        { status: 409 }
      );
    }

    // --- New Verification Logic ---
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

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

    // --- Send Verification Email ---
    try {
      const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`;

      await resend.emails.send({
        from: "onboarding@resend.dev", // Or your custom domain
        to: email,
        subject: "Verify Your Email Address",
        react: VerificationEmail({ verificationLink }),
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Decide if you want to fail the whole request or just log the error
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
