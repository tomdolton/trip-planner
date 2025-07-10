import { supabase } from "../supabase";

export async function deleteActivity({ id }: { id: string }) {
  const { error } = await supabase.from("activities").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return true;
}
