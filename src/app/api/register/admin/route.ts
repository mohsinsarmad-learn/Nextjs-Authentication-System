import { connectToDatabase } from "@/lib/dbConnect";
import Admin from "@/models/Admin";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
import { AdminVerificationNotice } from "@/emails/AdminVerificationNotice";
import { adminRegisterSchema } from "@/schemas/backend/admin";
import { z } from "zod";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = adminRegisterSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid input",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }
    const { firstname, lastname, email, password, contact } = validation.data;
    await connectToDatabase();

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { message: "Admin with this email already exists." },
        { status: 409 }
      );
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const newAdmin = new Admin({
      firstname,
      lastname,
      email,
      password,
      contact: contact || undefined,
      userType: "Admin",
      verificationToken,
      verificationTokenExpires,
      isVerified: false,
    });

    await newAdmin.save();

    try {
      const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}&type=admin`;
      const itAdminEmail = process.env.IT_ADMIN_EMAIL!;

      if (!itAdminEmail) {
        throw new Error(
          "IT_ADMIN_EMAIL is not defined in environment variables."
        );
      }
      const from = process.env.EMAIL_FROM!;
      await resend.emails.send({
        from: from,
        to: itAdminEmail,
        subject: `Action Required: New Admin Account needs approval`,
        react: AdminVerificationNotice({
          verificationLink,
          newAdminEmail: email,
          newAdminName: `${firstname} ${lastname}`, // Add this line
        }),
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      return NextResponse.json(
        { message: "Admin registered, but failed to send verification email." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message:
          "Admin registered successfully. A verification email has been sent to the IT department for approval.",
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
    console.error("Admin Registration Error:", error);
    return NextResponse.json(
      {
        message: "An error occurred during registration.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
