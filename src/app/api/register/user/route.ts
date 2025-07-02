// src/app/api/register/user/route.ts
import { connectToDatabase } from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await connectToDatabase();

  try {
    const { firstname, lastname, email, password, contact } =
      await request.json();

    // --- Server-Side Validation ---
    if (!firstname || !lastname || !email || !password) {
      return NextResponse.json(
        { message: "All required fields must be provided." },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists." },
        { status: 409 } // 409 Conflict
      );
    }

    // Create a new user instance (password will be hashed by the pre-save hook in your model)
    const newUser = new User({
      firstname,
      lastname,
      email,
      password,
      contact: contact || undefined, // Only include contact if it exists
      userType: "User", // Explicitly set userType
    });

    await newUser.save();

    return NextResponse.json(
      { message: "User registered successfully." },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("User Registration Error:", error);
    return NextResponse.json(
      {
        message: "An error occurred during registration.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
