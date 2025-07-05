import { connectToDatabase } from "@/lib/dbConnect";
import Admin from "@/models/Admin";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
import { PasswordResetEmail } from "@/emails/PasswordResetEmail";
import { passwordResetRequestSchema } from "@/schemas/backend/admin";
import { z } from "zod";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = passwordResetRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid input data",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }
    const { email } = validation.data;
    await connectToDatabase();
    const admin = await Admin.findOne({ email });
    if (admin && admin.isVerified) {
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
      //TODO:Fix From email address
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
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
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "An error occurred." },
      { status: 500 }
    );
  }
}
