// src/app/api/profile/admin/route.ts
import { connectToDatabase } from "@/lib/dbConnect";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import Admin from "@/models/Admin";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "Admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }
  await connectToDatabase();
  const admin = await Admin.findOne({ AdminId: session.user.id }).select(
    "-password"
  );
  if (!admin)
    return NextResponse.json({ message: "Admin not found" }, { status: 404 });
  return NextResponse.json(admin, { status: 200 });
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "Admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }
  await connectToDatabase();
  const adminId = session.user.id;
  const body = await request.json();
  const { firstname, lastname, contact, newImageUrl, newImageFileId } = body;
  const adminToUpdate = await Admin.findOne({ AdminId: adminId });
  if (!adminToUpdate)
    return NextResponse.json({ message: "Admin not found" }, { status: 404 });

  adminToUpdate.firstname = firstname;
  adminToUpdate.lastname = lastname;
  adminToUpdate.contact = contact;

  await adminToUpdate.save();
  return NextResponse.json(
    { message: "Admin profile updated successfully" },
    { status: 200 }
  );
}
