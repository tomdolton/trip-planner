import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Accommodation, Trip, TripPhase, Location } from "@/types/trip";

import { updateAccommodation } from "@/lib/api/updateAccommodation";

export function useUpdateAccommodation(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    Accommodation,
    Error,
    Partial<Accommodation> & { id: string },
    { previousTrip?: Trip }
  >({
    mutationFn: updateAccommodation,
    onMutate: async (updatedAccommodation) => {
      await queryClient.cancelQueries({ queryKey: ["trip", tripId] });
      const previousTrip = queryClient.getQueryData<Trip>(["trip", tripId]);

      queryClient.setQueryData(["trip", tripId], (old: Trip | undefined) => {
        if (!old?.trip_phases) return old;
        return {
          ...old,
          trip_phases: old.trip_phases.map((phase: TripPhase) => ({
            ...phase,
            locations: phase.locations?.map((loc: Location) => {
              if (!loc.accommodations?.some((acc) => acc.id === updatedAccommodation.id)) {
                return loc;
              }
              return {
                ...loc,
                accommodations: loc.accommodations.map((acc: Accommodation) =>
                  acc.id === updatedAccommodation.id ? { ...acc, ...updatedAccommodation } : acc
                ),
              };
            }),
          })),
        };
      });

      return { previousTrip };
    },
    onError: (_err, _updatedAccommodation, context) => {
      if (context?.previousTrip) {
        queryClient.setQueryData(["trip", tripId], context.previousTrip);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] });
    },
  });
}
