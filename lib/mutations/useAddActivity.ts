import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addActivity } from "@/lib/api/addActivity";
import type { ActivityType } from "@/lib/constants/activityTypes";
import { useUser } from "@/hooks/useUser";

export function useAddActivity(tripId: string) {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: (values: {
      locationId: string;
      name: string;
      date: string;
      start_time?: string;
      end_time?: string;
      notes?: string;
      placeId?: string;
      activity_type: ActivityType;
    }) => {
      const userId = user?.id;
      if (!userId) {
        throw new Error("User ID is required to add an activity.");
      }
      return addActivity({ ...values, tripId, userId });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] });
    },
  });
}
