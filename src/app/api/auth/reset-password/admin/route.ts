// src/app/api/auth/reset-password/admin/route.ts
import { connectToDatabase } from "@/lib/dbConnect";
import Admin from "@/models/Admin"; // Changed to Admin model
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  await connectToDatabase();
  try {
    const { token, newPassword } = await request.json();
    if (!token || !newPassword) {
      return NextResponse.json(
        { message: "Token and new password are required." },
        { status: 400 }
      );
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const admin = await Admin.findOne({
      passwordResetToken: hashedToken,
      passwordResetTokenExpires: { $gt: Date.now() },
    });

    if (!admin) {
      return NextResponse.json(
        { message: "Invalid or expired password reset token." },
        { status: 400 }
      );
    }

    admin.password = newPassword;
    admin.passwordResetToken = undefined;
    admin.passwordResetTokenExpires = undefined;
    await admin.save();

    return NextResponse.json(
      { message: "Password has been reset successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "An error occurred during password reset." },
      { status: 500 }
    );
  }
}
