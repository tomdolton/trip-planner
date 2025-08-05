import { NextRequest, NextResponse } from "next/server";

import { GooglePlacesApiResponse, transformGooglePlaceApiResult } from "@/types/google-places";

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Use server-side only API key (no NEXT_PUBLIC_ prefix)
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.error("Google Places API key not found");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.location,places.types,places.rating,places.priceLevel,places.regularOpeningHours,places.photos,places.websiteUri,places.nationalPhoneNumber",
      },
      body: JSON.stringify({
        textQuery: query,
        maxResultCount: 10,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Places API error:", errorText);
      throw new Error(`Places API error: ${response.status}`);
    }

    const data: GooglePlacesApiResponse = await response.json();

    // Transform using the helper function
    const places = data.places?.map(transformGooglePlaceApiResult) || [];

    return NextResponse.json({ places });
  } catch (error) {
    console.error("Error searching places:", error);
    return NextResponse.json({ error: "Failed to search places" }, { status: 500 });
  }
}
