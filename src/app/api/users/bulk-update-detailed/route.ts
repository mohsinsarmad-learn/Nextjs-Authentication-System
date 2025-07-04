// src/app/api/users/bulk-update-detailed/route.ts
import { connectToDatabase } from "@/lib/dbConnect";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import User from "@/models/User";
import imagekit from "@/lib/imagekit";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  await connectToDatabase();

  try {
    const updates = await request.json(); // Expecting an array of update objects
    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json(
        { message: "No update data provided." },
        { status: 400 }
      );
    }

    const updatePromises = updates.map(async (update) => {
      const {
        userId,
        firstname,
        lastname,
        contact,
        newPassword,
        newImageUrl,
        newImageFileId,
      } = update;

      const userToUpdate = await User.findOne({ UserId: userId });
      if (!userToUpdate) return; // Skip if user not found

      // Handle image update
      if (newImageFileId && userToUpdate.profilePicFileId) {
        await imagekit.deleteFile(userToUpdate.profilePicFileId);
      }
      if (newImageUrl) userToUpdate.profilepic = newImageUrl;
      if (newImageFileId) userToUpdate.profilePicFileId = newImageFileId;

      // Handle password update
      if (newPassword && newPassword.length > 0) {
        userToUpdate.password = newPassword;
      }

      // Update other fields
      userToUpdate.firstname = firstname;
      userToUpdate.lastname = lastname;
      userToUpdate.contact = contact;

      return userToUpdate.save();
    });

    await Promise.all(updatePromises);

    return NextResponse.json(
      { message: "Users updated successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Detailed Bulk Update Error:", error);
    return NextResponse.json(
      { message: "Error during bulk update", error: error.message },
      { status: 500 }
    );
  }
}
