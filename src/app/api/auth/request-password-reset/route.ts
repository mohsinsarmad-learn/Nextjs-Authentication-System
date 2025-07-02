// src/app/api/auth/request-password-reset/route.ts
import { connectToDatabase } from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
import { PasswordResetEmail } from "@/emails/PasswordResetEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  await connectToDatabase();
  try {
    const { email } = await request.json();

    const user = await User.findOne({ email });

    // Security: Don't reveal if the user exists or not.
    // Always return a success message.
    if (user) {
      // Generate a secure token
      const resetToken = crypto.randomBytes(32).toString("hex");

      // Hash the token before saving it to the database
      const passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      const passwordResetTokenExpires = new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ); // 24 hours

      user.passwordResetToken = passwordResetToken;
      user.passwordResetTokenExpires = passwordResetTokenExpires;
      await user.save();

      // Send the email with the un-hashed token
      const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Your Password Reset Link",
        react: PasswordResetEmail({ resetLink }),
      });
    }

    return NextResponse.json(
      {
        message:
          "If an account with that email exists, a password reset link has been sent.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Request Password Reset Error:", error);
    return NextResponse.json(
      { message: "An error occurred." },
      { status: 500 }
    );
  }
}
