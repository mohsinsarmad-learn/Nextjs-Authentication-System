import imagekit from "@/lib/imagekit";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // This generates temporary credentials for the client-side upload
    const authenticationParameters = imagekit.getAuthenticationParameters();

    // Return the credentials to the client
    return NextResponse.json(authenticationParameters);
  } catch (error: any) {
    console.error("ImageKit Auth Error:", error);
    return NextResponse.json(
      {
        message: "Error getting ImageKit authentication parameters",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
