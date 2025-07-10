import { Accommodation } from "@/types/trip";

import { supabase } from "../supabase";

export async function updateAccommodation(accommodation: Partial<Accommodation> & { id: string }) {
  const { id, ...fields } = accommodation;
  const { data, error } = await supabase
    .from("accommodations")
    .update(fields)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}
