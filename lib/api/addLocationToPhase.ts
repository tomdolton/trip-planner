import { supabase } from "../supabase";

export async function addLocationToPhase(
  phaseId: string,
  name: string,
  tripId: string,
  userId?: string
) {
  const { data, error } = await supabase
    .from("locations")
    .insert([{ name, trip_id: tripId, trip_phase_id: phaseId, user_id: userId }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
