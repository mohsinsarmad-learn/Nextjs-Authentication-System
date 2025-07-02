// src/app/api/profile/user/change-password/route.ts
import { connectToDatabase } from "@/lib/dbConnect";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "User") {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  await connectToDatabase();
  try {
    const { currentPassword, newPassword } = await request.json();
    const userId = session.user.id;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "Current and new passwords are required." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ UserId: userId });
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // Verify the current password
    const isCurrentPasswordCorrect =
      await user.comparePassword(currentPassword);
    if (!isCurrentPasswordCorrect) {
      return NextResponse.json(
        { message: "Incorrect current password." },
        { status: 403 }
      ); // 403 Forbidden
    }

    // Set the new password (the pre-save hook will hash it)
    user.password = newPassword;
    await user.save();

    return NextResponse.json(
      { message: "Password updated successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Change Password Error:", error);
    return NextResponse.json(
      { message: "Error changing password", error: error.message },
      { status: 500 }
    );
  }
}
