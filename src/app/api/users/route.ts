// src/app/api/users/route.ts
import { connectToDatabase } from "@/lib/dbConnect";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import User from "@/models/User";
import imagekit from "@/lib/imagekit";
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

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  await connectToDatabase();

  try {
    const url = new URL(request.url);
    const singleUserId = url.searchParams.get("id");

    // --- Case 1: Handle Single User Deletion ---
    if (singleUserId) {
      const userToDelete = await User.findOne({ UserId: singleUserId });
      if (!userToDelete) {
        return NextResponse.json(
          { message: "User not found." },
          { status: 404 }
        );
      }

      // Delete from ImageKit if exists
      if (userToDelete.profilePicFileId) {
        await imagekit.deleteFile(userToDelete.profilePicFileId);
      }

      // Delete from MongoDB
      await User.deleteOne({ UserId: singleUserId });
      return NextResponse.json(
        { message: "User deleted successfully." },
        { status: 200 }
      );
    }

    // --- Case 2: Handle Bulk User Deletion ---
    const { userIds } = await request.json();
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { message: "User IDs are required for bulk deletion." },
        { status: 400 }
      );
    }

    const usersToDelete = await User.find({ UserId: { $in: userIds } });
    const fileIdsToDelete = usersToDelete
      .map((user) => user.profilePicFileId)
      .filter(Boolean); // Filter out any null/undefined file IDs

    if (fileIdsToDelete.length > 0) {
      await imagekit.bulkDeleteFiles(fileIdsToDelete as string[]);
    }

    const deleteResult = await User.deleteMany({ UserId: { $in: userIds } });

    return NextResponse.json(
      { message: `${deleteResult.deletedCount} user(s) deleted successfully.` },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting users:", error);
    // Check for JSON parsing errors specifically
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { message: "Invalid request body for bulk delete." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Error deleting users", error: error.message },
      { status: 500 }
    );
  }
}
