import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { downloadUrl } = await request.json();

    if (!downloadUrl) {
      return NextResponse.json({ error: "Download URL is required" }, { status: 400 });
    }

    // Trigger the download event to Unsplash
    const response = await fetch(downloadUrl, {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to track download");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking download:", error);
    return NextResponse.json({ error: "Failed to track download" }, { status: 500 });
  }
}
