import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Journey } from "@/types/trip";

import { supabase } from "@/lib/supabase";
import { normalizeTime } from "@/lib/utils/normalizeTime";

export function useAddJourney(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation<Journey, Error, Omit<Journey, "id">>({
    mutationFn: async (data) => {
      const normalizedData = {
        ...data,
        departure_time: data.departure_time ? normalizeTime(data.departure_time) : null,
        arrival_time: data.arrival_time ? normalizeTime(data.arrival_time) : null,
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
