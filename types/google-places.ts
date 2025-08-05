// Google Places API Response Types (what comes from Google's API)
export interface GooglePlacesApiResponse {
  places?: GooglePlaceApiResult[];
}

export interface GooglePlaceApiResult {
  id: string;
  displayName?: {
    text: string;
  };
  formattedAddress?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  types?: string[];
  rating?: number;
  priceLevel?: number;
  regularOpeningHours?: GooglePlaceApiOpeningHours;
  photos?: GooglePlaceApiPhoto[];
  websiteUri?: string;
  nationalPhoneNumber?: string;
}

export interface GooglePlaceApiOpeningHours {
  openNow?: boolean;
  periods?: Array<{
    open: { day: number; hour: number; minute: number };
    close?: { day: number; hour: number; minute: number };
  }>;
  weekdayDescriptions?: string[];
}

export interface GooglePlaceApiPhoto {
  name: string;
  widthPx: number;
  heightPx: number;
}

// Client-side Types (what we use in our components)
export interface GooglePlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
  lat: number;
  lng: number;
  types: string[];
  rating?: number;
  price_level?: number;
  opening_hours?: GooglePlaceOpeningHours;
  photos?: GooglePlacePhoto[];
  website?: string;
  formatted_phone_number?: string;
}

export interface GooglePlaceOpeningHours {
  openNow?: boolean;
  periods?: Array<{
    open: { day: number; hour: number; minute: number };
    close?: { day: number; hour: number; minute: number };
  }>;
  weekdayDescriptions?: string[];
}

export interface GooglePlacePhoto {
  name: string;
  widthPx: number;
  heightPx: number;
}

// Type guard to help with transformations
export function isValidGooglePlace(place: unknown): place is GooglePlaceApiResult {
  return (
    typeof place === "object" &&
    place !== null &&
    typeof (place as GooglePlaceApiResult).id === "string"
  );
}

// Transformation helper
export function transformGooglePlaceApiResult(place: GooglePlaceApiResult): GooglePlaceResult {
  return {
    place_id: place.id,
    name: place.displayName?.text || "",
    formatted_address: place.formattedAddress || "",
    lat: place.location?.latitude || 0,
    lng: place.location?.longitude || 0,
    types: place.types || [],
    rating: place.rating,
    price_level: place.priceLevel,
    opening_hours: place.regularOpeningHours,
    photos: place.photos,
    website: place.websiteUri,
    formatted_phone_number: place.nationalPhoneNumber,
  };
}
