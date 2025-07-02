// src/app/api/profile/user/route.ts
import { connectToDatabase } from "@/lib/dbConnect";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import User from "@/models/User";
import imagekit from "@/lib/imagekit";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "User") {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  await connectToDatabase();
  try {
    const userId = session.user.id;
    const body = await request.json();
    const { firstname, lastname, contact, newImageUrl, newImageFileId } = body;

    const userToUpdate = await User.findOne({ UserId: userId });
    if (!userToUpdate) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // If a new image is being uploaded, delete the old one first
    if (newImageFileId && userToUpdate.profilePicFileId) {
      try {
        await imagekit.deleteFile(userToUpdate.profilePicFileId);
      } catch (deleteError) {
        console.error("Failed to delete old image from ImageKit:", deleteError);
        // Non-fatal error, we can still proceed with updating the profile
      }
    }

    // Update user fields
    userToUpdate.firstname = firstname;
    userToUpdate.lastname = lastname;
    userToUpdate.contact = contact;
    if (newImageUrl) {
      userToUpdate.profilepic = newImageUrl;
    }
    if (newImageFileId) {
      userToUpdate.profilePicFileId = newImageFileId;
    }

    await userToUpdate.save();

    return NextResponse.json(
      { message: "Profile updated successfully", user: userToUpdate },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Profile Update Error:", error);
    return NextResponse.json(
      { message: "Error updating profile", error: error.message },
      { status: 500 }
    );
  }
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
