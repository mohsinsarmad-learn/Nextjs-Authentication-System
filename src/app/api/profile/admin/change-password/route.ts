import { connectToDatabase } from "@/lib/dbConnect";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import Admin from "@/models/Admin";
import { NextResponse } from "next/server";
import { passwordChangeSchema } from "@/schemas/backend/admin";
import z from "zod";

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "Admin") {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }
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
    const adminId = session.user.id;
    await connectToDatabase();
    const admin = await Admin.findOne({ AdminId: adminId });
    if (!admin)
      return NextResponse.json({ message: "Admin not found" }, { status: 404 });

    const isCurrentPasswordCorrect =
      await admin.comparePassword(currentPassword);
    if (!isCurrentPasswordCorrect) {
      return NextResponse.json(
        { message: "Incorrect current password." },
        { status: 403 }
      );
    }

    admin.password = newPassword;
    await admin.save();
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
