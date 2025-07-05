import { connectToDatabase } from "@/lib/dbConnect";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { userProfileUpdateSchema } from "@/schemas/backend/user";
import z from "zod";
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "User") {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }
    const body = await request.json();
    const validation = userProfileUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid input data",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { firstname, lastname, contact } = validation.data;
    await connectToDatabase();
    const userToUpdate = await User.findOne({ UserId: session.user.id });
    if (!userToUpdate)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    userToUpdate.firstname = firstname;
    userToUpdate.lastname = lastname;
    userToUpdate.contact = contact;
    await userToUpdate.save();
    return NextResponse.json(
      { message: "Profile updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }
    console.error("Profile Update Error:", error);
    return NextResponse.json(
      { message: "Error updating profile", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
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
