import { supabase } from "../supabase";

export async function deleteLocation({ id }: { id: string }) {
  const { error } = await supabase.from("locations").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return true;
}
