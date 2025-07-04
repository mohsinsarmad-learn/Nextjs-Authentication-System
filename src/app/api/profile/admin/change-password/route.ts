// src/app/api/profile/admin/change-password/route.ts
import { connectToDatabase } from "@/lib/dbConnect";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import Admin from "@/models/Admin";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "Admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }
  await connectToDatabase();
  const { currentPassword, newPassword } = await request.json();
  const admin = await Admin.findOne({ AdminId: session.user.id });
  if (!admin)
    return NextResponse.json({ message: "Admin not found" }, { status: 404 });

  const isCurrentPasswordCorrect = await admin.comparePassword(currentPassword);
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
}
