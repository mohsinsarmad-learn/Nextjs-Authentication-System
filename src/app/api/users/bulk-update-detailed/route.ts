import { connectToDatabase } from "@/lib/dbConnect";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import User from "@/models/User";
import imagekit from "@/lib/imagekit";
import { NextResponse } from "next/server";
import { detailedBulkUpdateSchema } from "@/schemas/backend/admin";
import z from "zod";

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  await connectToDatabase();

  try {
    const body = await request.json();

    const validation = detailedBulkUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid input data",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }
    const updates = validation.data;

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
      if (!userToUpdate) return;

      if (newImageFileId && userToUpdate.profilePicFileId) {
        await imagekit.deleteFile(userToUpdate.profilePicFileId);
      }
      if (newImageUrl) userToUpdate.profilepic = newImageUrl;
      if (newImageFileId) userToUpdate.profilePicFileId = newImageFileId;

      if (newPassword && newPassword.length > 0) {
        userToUpdate.password = newPassword;
      }

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
    if (error instanceof z.ZodError) {
      // This case should be caught by safeParse, but as a fallback
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Error during bulk update", error: error.message },
      { status: 500 }
    );
  }
}
