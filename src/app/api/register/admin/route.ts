// src/app/api/register/admin/route.ts
import { connectToDatabase } from "@/lib/dbConnect";
import Admin from "@/models/Admin";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
import { AdminVerificationNotice } from "@/emails/AdminVerificationNotice"; // Import the admin template

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

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { message: "Admin with this email already exists." },
        { status: 409 }
      );
    }

    // --- New Verification Logic ---
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

    // --- Send Verification Email to IT Admin ---
    try {
      const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`;
      const itAdminEmail = process.env.IT_ADMIN_EMAIL!;

      if (!itAdminEmail) {
        throw new Error(
          "IT_ADMIN_EMAIL is not defined in environment variables."
        );
      }

      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: itAdminEmail, // Send email to the IT Admin
        subject: "Action Required: New Admin Account Verification",
        react: AdminVerificationNotice({
          verificationLink,
          newAdminEmail: email,
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
