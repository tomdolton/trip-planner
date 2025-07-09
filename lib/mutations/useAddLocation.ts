import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Trip, TripPhase } from "@/types/trip";

import { addLocationToPhase } from "@/lib/api/addLocationToPhase";

import { useUser } from "@/hooks/useUser";

export function useAddLocation(tripId: string) {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const userId = user?.id;

  return useMutation({
    mutationFn: ({ phaseId, name }: { phaseId: string; name: string }) =>
      // Call the API to add the location to the specified phase
      addLocationToPhase(phaseId, name, tripId, userId),

    onMutate: async ({ phaseId, name }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["trip", tripId] });

      // Snapshot the previous trip data
      const prevTrip = queryClient.getQueryData(["trip", tripId]);

      // Optimistically update to the new value
      queryClient.setQueryData(["trip", tripId], (old: Trip) => {
        return {
          ...old,
          trip_phases: old.trip_phases
            ? old.trip_phases.map((phase: TripPhase) =>
                phase.id === phaseId
                  ? {
                      ...phase,
                      locations: [
                        ...(phase.locations || []),
                        { id: crypto.randomUUID(), name, accommodations: [] },
                      ],
                    }
                  : phase
              )
            : [],
        };
      });
      // Return the previous trip data for rollback in case of error
      return { prevTrip };
    },

    onError: (_, __, context) => {
      // Rollback to the previous trip data
      queryClient.setQueryData(["trip", tripId], context?.prevTrip);
    },

    onSettled: () => {
      // Invalidate the trip query to refetch the latest data
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] });
    },
  });
}
