import { connectToDatabase } from "@/lib/dbConnect";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import Admin from "@/models/Admin";
import imagekit from "@/lib/imagekit";
import { NextResponse } from "next/server";
import { pictureUpdateSchema } from "@/schemas/backend/admin";
import z from "zod";
export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "Admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validation = pictureUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid input of Picture Update",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }
    const { newImageUrl, newImageFileId } = validation.data;
    await connectToDatabase();
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
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }
    console.error("Profile Picture Update Error:", error);
    return NextResponse.json(
      { message: "Error updating profile picture", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "Admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  await connectToDatabase();
  try {
    const adminToUpdate = await Admin.findOne({ AdminId: session.user.id });
    if (!adminToUpdate) {
      return NextResponse.json(
        { message: "Admin not found." },
        { status: 404 }
      );
    }

    if (adminToUpdate.profilePicFileId) {
      await imagekit.deleteFile(adminToUpdate.profilePicFileId);
    }

    // Reset to default
    adminToUpdate.profilepic = ""; // Or your default avatar URL
    adminToUpdate.profilePicFileId = undefined;

    await adminToUpdate.save();

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
