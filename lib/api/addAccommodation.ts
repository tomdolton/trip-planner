import { supabase } from "../supabase";

export async function addAccommodation({
  tripId,
  locationId,
  name,
  check_in,
  check_out,
  notes,
  url,
}: {
  tripId: string;
  locationId: string;
  name: string;
  check_in?: string;
  check_out?: string;
  notes?: string;
  url?: string;
}) {
  const { data, error } = await supabase
    .from("accommodations")
    .insert([
      {
        trip_id: tripId,
        location_id: locationId,
        name,
        check_in,
        check_out,
        notes,
        url,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
