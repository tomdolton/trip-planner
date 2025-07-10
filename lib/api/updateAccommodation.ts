import { Accommodation } from "@/types/trip";

import { supabase } from "../supabase";

export async function updateAccommodation(accommodation: Partial<Accommodation> & { id: string }) {
  const { id, check_in, check_out, ...fields } = accommodation;
  const { data, error } = await supabase
    .from("accommodations")
    .update({
      ...fields,
      check_in: check_in || null,
      check_out: check_out || null,
    })
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}
