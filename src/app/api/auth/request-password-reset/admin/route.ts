// src/app/api/auth/request-password-reset/admin/route.ts
import { connectToDatabase } from "@/lib/dbConnect";
import Admin from "@/models/Admin"; // Changed to Admin model
import { NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
import { PasswordResetEmail } from "@/emails/PasswordResetEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  await connectToDatabase();
  try {
    const { email } = await request.json();
    const admin = await Admin.findOne({ email });

    if (admin) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
      const passwordResetTokenExpires = new Date(
        Date.now() + 24 * 60 * 60 * 1000
      );

      admin.passwordResetToken = passwordResetToken;
      admin.passwordResetTokenExpires = passwordResetTokenExpires;
      await admin.save();

      const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/admin?token=${resetToken}`;

      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email, // Email goes to the admin themselves
        subject: "Your Admin Account Password Reset Link",
        react: PasswordResetEmail({ resetLink }),
      });
    }

    return NextResponse.json(
      {
        message:
          "If an admin account with that email exists, a password reset link has been sent.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "An error occurred." },
      { status: 500 }
    );
  }
}
