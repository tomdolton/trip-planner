import { Trip } from "@/types/trip";

import { supabase } from "../supabase";

export async function getTripById(id: string): Promise<Trip | null> {
  const { data, error } = await supabase
    .from("trips")
    .select(
      `
      *,
      trip_phases (
        *,
        locations (
          *,
          accommodations (*),
          activities (*)
        )
      ),
      journeys (*),
      unassigned_locations:locations!trip_id (
        *,
        accommodations (*),
        activities (*)
      )
    `
    )
    .eq("id", id)
    .is("unassigned_locations.trip_phase_id", null)
    .single();

  if (error) throw new Error(error.message);
  return data;
}
