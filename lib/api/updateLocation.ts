import { Location } from "@/types/trip";

import { supabase } from "../supabase";

export async function updateLocation(location: Partial<Location> & { id: string }) {
  const { id, ...fields } = location;
  const { data, error } = await supabase
    .from("locations")
    .update(fields)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}
