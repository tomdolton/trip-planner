import { useMutation, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";

export interface TripPhaseFormValues {
  title: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  order?: number;
}

export function useUpdateTripPhase(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, TripPhaseFormValues & { id: string }>({
    mutationFn: async ({ id, ...data }) => {
      // Clean up empty date strings and convert to null
      const cleanedData = {
        ...data,
        start_date: data.start_date?.trim() || null,
        end_date: data.end_date?.trim() || null,
        description: data.description?.trim() || null,
      };

      const { error } = await supabase.from("trip_phases").update(cleanedData).eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] });
    },
  });
}
