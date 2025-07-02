// src/app/api/auth/reset-password/route.ts
import { connectToDatabase } from "@/lib/dbConnect";
import User from "@/models/User";
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

    // Hash the incoming token to match the one stored in the database
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find the user with the valid, unexpired token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired password reset token." },
        { status: 400 }
      );
    }

    // Set the new password (the pre-save hook in the model will hash it)
    user.password = newPassword;
    // Clear the reset token fields so it cannot be used again
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;

    await user.save();

    return NextResponse.json(
      { message: "Password has been reset successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Reset Password Error:", error);
    return NextResponse.json(
      { message: "An error occurred during password reset." },
      { status: 500 }
    );
  }
}
