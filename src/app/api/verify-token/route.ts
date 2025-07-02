// src/app/api/verify-token/route.ts
import { connectToDatabase } from "@/lib/dbConnect";
import User from "@/models/User";
import Admin from "@/models/Admin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await connectToDatabase();
  try {
    const token = request.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { message: "Verification token is missing." },
        { status: 400 }
      );
    }

    // Find the user or admin with the matching token
    let account = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!account) {
      account = await Admin.findOne({
        verificationToken: token,
        verificationTokenExpires: { $gt: Date.now() },
      });
    }

    if (!account) {
      return NextResponse.json(
        { message: "Invalid or expired verification token." },
        { status: 400 }
      );
    }

    // Mark the account as verified and clear token fields
    account.isVerified = true;
    account.verificationToken = undefined;
    account.verificationTokenExpires = undefined;

    await account.save();

    return NextResponse.json(
      { message: "Account verified successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Verification Error:", error);
    return NextResponse.json(
      { message: "An error occurred during verification." },
      { status: 500 }
    );
  }
}
