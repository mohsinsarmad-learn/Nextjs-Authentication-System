// src/app/api/profile/admin/picture/route.ts
import { connectToDatabase } from "@/lib/dbConnect";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import Admin from "@/models/Admin";
import imagekit from "@/lib/imagekit";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "Admin") {
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

    const adminToUpdate = await Admin.findOne({ AdminId: session.user.id });
    if (!adminToUpdate) {
      return NextResponse.json(
        { message: "Admin not found." },
        { status: 404 }
      );
    }

    // If an old image file ID exists, delete it from ImageKit
    if (adminToUpdate.profilePicFileId) {
      try {
        await imagekit.deleteFile(adminToUpdate.profilePicFileId);
      } catch (deleteError) {
        console.error(
          "Non-fatal: Failed to delete old image from ImageKit.",
          deleteError
        );
      }
    }

    // Update the admin document with the new image info
    adminToUpdate.profilepic = newImageUrl;
    adminToUpdate.profilePicFileId = newImageFileId;

    await adminToUpdate.save();

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
