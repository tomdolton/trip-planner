import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Trip } from "@/types/trip";

import { deleteActivity } from "@/lib/api/deleteActivity";

export function useDeleteActivity(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteActivity,
    onMutate: async ({ id }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["trip", tripId] });

      // Snapshot the previous value
      const previousTrip = queryClient.getQueryData<Trip>(["trip", tripId]);

      // Optimistically update to remove the activity
      queryClient.setQueryData<Trip>(["trip", tripId], (old) => {
        if (!old) return old;

        const updatedTrip = {
          ...old,
          trip_phases: old.trip_phases?.map((phase) => ({
            ...phase,
            locations: phase.locations?.map((location) => {
              const filteredActivities =
                location.activities?.filter((activity) => activity.id !== id) || [];
              return {
                ...location,
                activities: filteredActivities,
              };
            }),
          })),
          unassigned_locations: old.unassigned_locations?.map((location) => {
            const filteredActivities =
              location.activities?.filter((activity) => activity.id !== id) || [];
            return {
              ...location,
              activities: filteredActivities,
            };
          }),
        };

        return updatedTrip;
      });

      return { previousTrip };
    },
    onError: (_err, _variables, context) => {
      // If the mutation fails, roll back to the previous value
      if (context?.previousTrip) {
        queryClient.setQueryData(["trip", tripId], context.previousTrip);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] });
    },
  });
}
