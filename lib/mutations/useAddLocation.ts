import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Trip, TripPhase } from "@/types/trip";

import { supabase } from "@/lib/supabase";

export function useAddLocation(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: {
      phaseId?: string;
      name: string;
      region?: string;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from("locations")
        .insert([
          {
            trip_id: tripId,
            trip_phase_id: values.phaseId || null,
            name: values.name,
            region: values.region || null,
            notes: values.notes || null,
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

        const newLocation = {
          id: `temp-${Math.random()}`,
          trip_id: tripId,
          trip_phase_id: values.phaseId,
          name: values.name,
          region: values.region,
          notes: values.notes,
          accommodations: [],
          activities: [],
        };

        // If no phaseId, add to unassigned_locations
        if (!values.phaseId) {
          return {
            ...old,
            unassigned_locations: [...(old.unassigned_locations || []), newLocation],
          };
        }

        // Otherwise, add to the specific phase
        return {
          ...old,
          trip_phases: old.trip_phases
            ? old.trip_phases.map((phase: TripPhase) =>
                phase.id === values.phaseId
                  ? {
                      ...phase,
                      locations: [...(phase.locations || []), newLocation],
                    }
                  : phase
              )
            : [],
        };
      });

      return { prevData };
    },

    onError: (_err, _newLocation, context) => {
      queryClient.setQueryData(["trip", tripId], context?.prevData);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] });
    },
  });
}
