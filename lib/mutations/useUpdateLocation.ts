import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Location } from "@/types/trip";

import { updateLocation } from "@/lib/api/updateLocation";

type TripWithLocations = { locations: Location[] } & Record<string, unknown>;

export function useUpdateLocation(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    Location,
    Error,
    Partial<Location> & { id: string },
    { previousLocations?: Location[] }
  >({
    mutationFn: updateLocation,
    onMutate: async (updatedLocation) => {
      await queryClient.cancelQueries({ queryKey: ["trip", tripId] });
      type TripWithLocations = { locations: Location[] } & Record<string, unknown>;
      const previousTrip = queryClient.getQueryData<TripWithLocations>(["trip", tripId]);
      const previousLocations = previousTrip?.locations;

      // Optimistically update the location in the trip
      queryClient.setQueryData(["trip", tripId], (old: TripWithLocations | undefined) => {
        if (!old?.locations) return old;
        return {
          ...old,
          locations: old.locations.map((loc: Location) =>
            loc.id === updatedLocation.id ? { ...loc, ...updatedLocation } : loc
          ),
        };
      });

      return { previousLocations };
    },
    onError: (_err, _updatedLocation, context) => {
      // Rollback to previous locations
      if (context?.previousLocations) {
        queryClient.setQueryData(["trip", tripId], (old: TripWithLocations | undefined) => ({
          ...old,
          locations: context.previousLocations,
        }));
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] });
    },
  });
}
