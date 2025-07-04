// src/app/api/profile/user/picture/route.ts
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
    const { newImageUrl, newImageFileId } = await request.json();
    if (!newImageUrl || !newImageFileId) {
      return NextResponse.json(
        { message: "New image data is required." },
        { status: 400 }
      );
    }

    const UserToUpdate = await User.findOne({ UserId: session.user.id });
    if (!UserToUpdate) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // If an old image file ID exists, delete it from ImageKit
    if (UserToUpdate.profilePicFileId) {
      try {
        await imagekit.deleteFile(UserToUpdate.profilePicFileId);
      } catch (deleteError) {
        console.error(
          "Non-fatal: Failed to delete old image from ImageKit.",
          deleteError
        );
      }
    }

    // Update the User document with the new image info
    UserToUpdate.profilepic = newImageUrl;
    UserToUpdate.profilePicFileId = newImageFileId;

    await UserToUpdate.save();

    return NextResponse.json(
      { message: "Profile picture updated successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Profile Picture Update Error:", error);
    return NextResponse.json(
      { message: "Error updating profile picture", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "User") {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  await connectToDatabase();
  try {
    const UserToUpdate = await User.findOne({ UserId: session.user.id });
    if (!UserToUpdate) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    if (UserToUpdate.profilePicFileId) {
      await imagekit.deleteFile(UserToUpdate.profilePicFileId);
    }

    // Reset to default
    UserToUpdate.profilepic = ""; // Or your default avatar URL
    UserToUpdate.profilePicFileId = undefined;

    await UserToUpdate.save();

    return NextResponse.json(
      { message: "Profile picture removed successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error removing profile picture" },
      { status: 500 }
    );
  }
}
