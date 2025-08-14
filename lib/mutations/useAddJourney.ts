import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Journey } from "@/types/trip";

import { supabase } from "@/lib/supabase";
import { normaliseTime } from "@/lib/utils/dateTime";

export function useAddJourney(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation<Journey, Error, Omit<Journey, "id">>({
    mutationFn: async (data) => {
      const normalizedData = {
        ...data,
        departure_time: data.departure_time ? normaliseTime(data.departure_time) : null,
        arrival_time: data.arrival_time ? normaliseTime(data.arrival_time) : null,
      };
      const { data: inserted, error } = await supabase
        .from("journeys")
        .insert([normalizedData])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return inserted as Journey;
    },
    onSuccess: () => {
      // Refetch trip detail to show new journey
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] });
    },
  });
}
