import { connectToDatabase } from "@/lib/dbConnect";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import User from "@/models/User";
import imagekit from "@/lib/imagekit";
import { NextResponse } from "next/server";
import { adminUpdatesUserSchema } from "@/schemas/backend/admin";
import z from "zod";

interface Params {
  userId: string;
}

export async function PUT(request: Request, { params }: { params: Params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  try {
    const { userId } = await params;
    const body = await request.json();

    const validation = adminUpdatesUserSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid input",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }
    const {
      firstname,
      lastname,
      contact,
      newPassword,
      newImageUrl,
      newImageFileId,
    } = validation.data;

    await connectToDatabase();
    const userToUpdate = await User.findOne({ UserId: userId });
    if (!userToUpdate) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

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

    await userToUpdate.save();

    const updatedUser = userToUpdate.toObject();
    delete updatedUser.password;

    return NextResponse.json(
      { message: "User updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating user:", error);
    if (error instanceof z.ZodError) {
      // This case should be caught by safeParse, but as a fallback
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Error updating user", error: error.message },
      { status: 500 }
    );
  }
}
