import { Activity } from "@/types/trip";

import { supabase } from "../supabase";

export async function updateActivity(activity: Partial<Activity> & { id: string }) {
  const { id, ...fields } = activity;
  const { data, error } = await supabase
    .from("activities")
    .update(fields)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}
