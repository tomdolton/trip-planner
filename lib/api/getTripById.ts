import { supabase } from "../supabase";
import { Trip } from "@/types/trip";

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
      journeys (*)
    `
    )
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}
