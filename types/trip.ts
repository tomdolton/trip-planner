import type { ActivityType } from "@/lib/constants/activityTypes";

export interface Trip {
  id: string;
  title: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  trip_phases?: TripPhase[];
  journeys?: Journey[];
  unassigned_locations?: Location[];
  image_search_hash?: string;
  unsplash_image_url?: string;
  unsplash_photographer_name?: string;
  unsplash_photographer_url?: string;
  unsplash_image_id?: string;
  unsplash_alt_description?: string;
}

export interface TripPhase {
  id: string;
  trip_id: string;
  title: string;
  description?: string;
  order?: number;
  start_date?: string;
  end_date?: string;
  locations?: Location[];
}

export interface Location {
  id: string;
  trip_id: string;
  trip_phase_id?: string;
  name: string; // User-customizable name (e.g., "Our hotel in Paris")
  region?: string;
  notes?: string;
  order?: number;
  place_id?: string; // Reference to places table
  place?: Place; // Populated via join - contains lat/lng
  accommodations?: Accommodation[];
  activities?: Activity[];
}

export interface Place {
  id: string;
  name: string; // Official place name (e.g., "Hotel Ritz Paris")
  description?: string;
  lat: number;
  lng: number;
  google_place_id?: string;
  place_types?: string[];
  formatted_address?: string;
  phone_number?: string;
  website?: string;
  rating?: number;
  price_level?: number;
  opening_hours?: string;
  photos?: string[];
  is_google_place: boolean;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Activity {
  id: string;
  trip_id: string;
  location_id: string;
  user_id: string;
  name: string;
  notes?: string;
  date: string;
  start_time?: string;
  end_time?: string;
  place_id?: string;
  activity_type: ActivityType;
}

export interface Accommodation {
  id: string;
  location_id: string;
  trip_id: string;
  name: string;
  url?: string;
  check_in?: string;
  check_out?: string;
  notes?: string;
}

export interface Journey {
  id: string;
  trip_id: string;
  departure_location_id: string;
  arrival_location_id: string;
  departure_time?: string;
  arrival_time?: string;
  mode: string;
  notes?: string;
  provider?: string;
}
