import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Trip } from "@/types/trip";

import { supabase } from "@/lib/supabase";

export function useAddTripPhase(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (title: string) => {
      const { data, error } = await supabase
        .from("trip_phases")
        .insert([{ title, trip_id: tripId }])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onMutate: async (title) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["trip", tripId] });

      // Snapshot the previous value
      const prevData = queryClient.getQueryData(["trip", tripId]);

      // Optimistically update to the new value
      queryClient.setQueryData(["trip", tripId], (old: Trip | undefined) => {
        if (!old) return old;
        // Add the new phase to the trip phases
        // Using a temporary ID for optimistic UI
        return {
          ...old,
          trip_phases: [
            ...(old?.trip_phases ?? []),
            {
              id: `temp-${Math.random()}`,
              title,
              description: null,
              locations: [],
            },
          ],
        };
      });

      return { prevData };
    },
    onError: (_err, _newPhase, context) => {
      queryClient.setQueryData(["trip", tripId], context?.prevData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] });
    },
  });
}
