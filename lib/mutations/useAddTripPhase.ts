import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Trip } from "@/types/trip";

import { supabase } from "@/lib/supabase";

export function useAddTripPhase(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: {
      title: string;
      description?: string;
      start_date?: string;
      end_date?: string;
    }) => {
      const { data, error } = await supabase
        .from("trip_phases")
        .insert([
          {
            title: values.title,
            description: values.description || null,
            start_date: values.start_date || null,
            end_date: values.end_date || null,
            trip_id: tripId,
          },
        ])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onMutate: async (values) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["trip", tripId] });

      // Snapshot the previous value
      const prevData = queryClient.getQueryData(["trip", tripId]);

      // Optimistically update to the new value
      queryClient.setQueryData(["trip", tripId], (old: Trip | undefined) => {
        if (!old) return old;
        return {
          ...old,
          trip_phases: [
            ...(old?.trip_phases ?? []),
            {
              id: `temp-${Math.random()}`,
              trip_id: tripId,
              title: values.title,
              description: values.description,
              start_date: values.start_date,
              end_date: values.end_date,
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
  });
}
