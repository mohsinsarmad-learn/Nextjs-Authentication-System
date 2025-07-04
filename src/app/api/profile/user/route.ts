// src/app/api/profile/user/route.ts
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
  const { firstname, lastname, contact } = await request.json();
  const userToUpdate = await User.findOne({ UserId: session.user.id });
  if (!userToUpdate)
    return NextResponse.json({ message: "User not found" }, { status: 404 });

  userToUpdate.firstname = firstname;
  userToUpdate.lastname = lastname;
  userToUpdate.contact = contact;
  await userToUpdate.save();
  return NextResponse.json(
    { message: "Profile updated successfully" },
    { status: 200 }
  );
}
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "User") {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  await connectToDatabase();
  try {
    const user = await User.findOne({ UserId: session.user.id }).select(
      "-password"
    );
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching user data" },
      { status: 500 }
    );
  }
}
