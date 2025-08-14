import { Activity } from "@/types/trip";

import { normaliseTime } from "@/lib/utils/dateTime";

import { supabase } from "../supabase";

export async function updateActivity(activity: Partial<Activity> & { id: string }) {
  const { id, start_time, end_time, ...fields } = activity;
  const { data, error } = await supabase
    .from("activities")
    .update({
      ...fields,
      start_time: normaliseTime(start_time),
      end_time: normaliseTime(end_time),
    })
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}
