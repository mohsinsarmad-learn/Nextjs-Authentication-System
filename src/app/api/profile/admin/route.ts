import { connectToDatabase } from "@/lib/dbConnect";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import Admin from "@/models/Admin";
import { NextResponse } from "next/server";
import { adminProfileUpdateSchema } from "@/schemas/backend/admin";
import z from "zod";
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "Admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }
  await connectToDatabase();
  const admin = await Admin.findOne({ AdminId: session.user.id }).select(
    "-password"
  );
  if (!admin)
    return NextResponse.json({ message: "Admin not found" }, { status: 404 });
  return NextResponse.json(admin, { status: 200 });
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "Admin") {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }
    const body = await request.json();
    const validation = adminProfileUpdateSchema.safeParse(body);

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
    const adminId = session.user.id;
    await connectToDatabase();
    const adminToUpdate = await Admin.findOne({ AdminId: adminId });
    if (!adminToUpdate)
      return NextResponse.json({ message: "Admin not found" }, { status: 404 });

    adminToUpdate.firstname = firstname;
    adminToUpdate.lastname = lastname;
    adminToUpdate.contact = contact;

    await adminToUpdate.save();
    return NextResponse.json(
      { message: "Admin profile updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }
    console.error("Admin Profile Update Error:", error);
    return NextResponse.json(
      { message: "Error updating admin profile", error: error.message },
      { status: 500 }
    );
  }
}
