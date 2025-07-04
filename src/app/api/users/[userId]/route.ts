// src/app/api/users/[userId]/route.ts
import { connectToDatabase } from "@/lib/dbConnect";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import User from "@/models/User";
import imagekit from "@/lib/imagekit";
import { NextResponse } from "next/server";

interface Params {
  userId: string;
}

export async function PUT(request: Request, { params }: { params: Params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  await connectToDatabase();
  try {
    const { userId } = await params;
    const body = await request.json();
    const {
      firstname,
      lastname,
      contact,
      newPassword,
      newImageUrl,
      newImageFileId,
    } = body;

    const userToUpdate = await User.findOne({ UserId: userId });
    if (!userToUpdate) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Handle image update
    if (newImageFileId && userToUpdate.profilePicFileId) {
      await imagekit.deleteFile(userToUpdate.profilePicFileId);
    }
    if (newImageUrl) userToUpdate.profilepic = newImageUrl;
    if (newImageFileId) userToUpdate.profilePicFileId = newImageFileId;

    // THE FIX: Only update the password if a new one is provided and not an empty string
    if (newPassword && newPassword.length > 0) {
      userToUpdate.password = newPassword; // Pre-save hook will hash it
    }

    // Update other fields
    userToUpdate.firstname = firstname;
    userToUpdate.lastname = lastname;
    userToUpdate.contact = contact;

    await userToUpdate.save();

    // Return the updated user object, excluding the password
    const updatedUser = userToUpdate.toObject();
    delete updatedUser.password;

    return NextResponse.json(
      { message: "User updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error updating user", error: error.message },
      { status: 500 }
    );
  }
}
