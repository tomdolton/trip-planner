import { ActivityType } from "@/lib/constants/activityTypes";
import { normaliseTime } from "@/lib/utils/dateTime";

import { supabase } from "../supabase";

export async function addActivity({
  tripId,
  locationId,
  name,
  date,
  start_time,
  end_time,
  notes,
  placeId,
  activity_type,
  userId,
}: {
  tripId: string;
  locationId: string;
  name: string;
  date: string; // YYYY-MM-DD
  start_time?: string; // optional - "HH:MM"
  end_time?: string;
  notes?: string;
  placeId?: string; // optional - for Google Places integration
  activity_type: ActivityType;
  userId: string;
}) {
  const { data, error } = await supabase
    .from("activities")
    .insert([
      {
        trip_id: tripId,
        location_id: locationId,
        name,
        date,
        start_time: normaliseTime(start_time),
        end_time: normaliseTime(end_time),
        notes,
        place_id: placeId,
        activity_type,
        user_id: userId,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
