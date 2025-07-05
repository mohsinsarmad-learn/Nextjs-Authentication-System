import { connectToDatabase } from "@/lib/dbConnect";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { passwordChangeSchema } from "@/schemas/backend/user";
import z from "zod";
export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "User") {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validation = passwordChangeSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid input",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }
    const { currentPassword, newPassword } = validation.data;
    const userId = session.user.id;

    await connectToDatabase();
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

    user.password = newPassword;
    await user.save();

    return NextResponse.json(
      { message: "Password updated successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }
    console.error("Change Password Error:", error);
    return NextResponse.json(
      { message: "Error changing password", error: error.message },
      { status: 500 }
    );
  }
}
