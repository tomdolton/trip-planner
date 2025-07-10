import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Activity, Location } from "@/types/trip";

import { updateActivity } from "@/lib/api/updateActivity";

export function useUpdateActivity(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    Activity,
    Error,
    Partial<Activity> & { id: string },
    { previousLocations?: Location[] }
  >({
    mutationFn: updateActivity,
    onMutate: async (updatedActivity) => {
      await queryClient.cancelQueries({ queryKey: ["trip", tripId] });
      const previousTrip = queryClient.getQueryData<{ locations?: Location[] }>(["trip", tripId]);
      const previousLocations = previousTrip?.locations;

      queryClient.setQueryData(["trip", tripId], (old: { locations?: Location[] } | undefined) => {
        if (!old?.locations) return old;
        return {
          ...old,
          locations: old.locations.map((loc: Location) => {
            if (!loc.activities?.some((act) => act.id === updatedActivity.id)) {
              return loc;
            }
            return {
              ...loc,
              activities: loc.activities.map((act: Activity) =>
                act.id === updatedActivity.id ? { ...act, ...updatedActivity } : act
              ),
            };
          }),
        };
      });

      return { previousLocations };
    },
    onError: (_err, _updatedActivity, context) => {
      if (context?.previousLocations) {
        queryClient.setQueryData(
          ["trip", tripId],
          (old: { locations?: Location[] } | undefined) => ({
            ...old,
            locations: context.previousLocations,
          })
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] });
    },
  });
}
