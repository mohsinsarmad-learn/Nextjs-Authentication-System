// src/app/api/users/route.ts
import { connectToDatabase } from "@/lib/dbConnect";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  // Protect the route: only admins can access
  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  await connectToDatabase();
  try {
    // Fetch all users and exclude their passwords from the result
    const users = await User.find({}).select("-password");

    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Error fetching users", error: error.message },
      { status: 500 }
    );
  }
}

// src/app/api/users/route.ts
// ... (keep existing GET function and imports) ...
import imagekit from "@/lib/imagekit";

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const userIdToDelete = searchParams.get("id");

  if (!userIdToDelete) {
    return NextResponse.json(
      { message: "User ID is required." },
      { status: 400 }
    );
  }

  await connectToDatabase();
  try {
    const userToDelete = await User.findOne({ UserId: userIdToDelete });

    if (!userToDelete) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // If the user has a profile picture file ID, delete it from ImageKit
    if (userToDelete.profilePicFileId) {
      try {
        await imagekit.deleteFile(userToDelete.profilePicFileId);
      } catch (deleteError) {
        console.error(
          "Failed to delete image from ImageKit, but proceeding with user deletion:",
          deleteError
        );
      }
    }

    // Delete the user from the database
    await User.deleteOne({ UserId: userIdToDelete });

    return NextResponse.json(
      { message: "User deleted successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Error deleting user", error: error.message },
      { status: 500 }
    );
  }
}
