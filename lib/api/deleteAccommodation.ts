import { supabase } from "../supabase";

export async function deleteAccommodation({ id }: { id: string }) {
  const { error } = await supabase.from("accommodations").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return true;
}
