// src/app/api/register/admin/route.ts
import { connectToDatabase } from "@/lib/dbConnect";
import Admin from "@/models/Admin"; // Changed to Admin model
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await connectToDatabase();
  try {
    const { firstname, lastname, email, password, contact } =
      await request.json();

    if (!firstname || !lastname || !email || !password) {
      return NextResponse.json(
        { message: "All required fields must be provided." },
        { status: 400 }
      );
    }

    const existingAdmin = await Admin.findOne({ email }); // Changed to Admin model
    if (existingAdmin) {
      return NextResponse.json(
        { message: "Admin with this email already exists." },
        { status: 409 }
      );
    }

    const newAdmin = new Admin({
      // Changed to Admin model
      firstname,
      lastname,
      email,
      password,
      contact: contact || undefined,
      userType: "Admin", // Explicitly set userType
    });

    await newAdmin.save();

    return NextResponse.json(
      { message: "Admin registered successfully." },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Admin Registration Error:", error);
    return NextResponse.json(
      {
        message: "An error occurred during registration.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
