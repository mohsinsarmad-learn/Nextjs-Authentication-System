import { connectToDatabase } from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { passwordResetSchema } from "@/schemas/backend/user";
import { z } from "zod";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = passwordResetSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid input data",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }
    const { token, newPassword } = validation.data;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    await connectToDatabase();
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

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;

    await user.save();

    return NextResponse.json(
      { message: "Password has been reset successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }
    console.error("Reset Password Error:", error);
    return NextResponse.json(
      { message: "An error occurred during password reset." },
      { status: 500 }
    );
  }
}
