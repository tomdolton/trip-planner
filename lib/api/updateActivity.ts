import { Activity } from "@/types/trip";

import { normalizeTime } from "@/lib/utils/normalizeTime";

import { supabase } from "../supabase";

export async function updateActivity(activity: Partial<Activity> & { id: string }) {
  const { id, start_time, end_time, ...fields } = activity;
  const { data, error } = await supabase
    .from("activities")
    .update({
      ...fields,
      start_time: normalizeTime(start_time),
      end_time: normalizeTime(end_time),
    })
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}
