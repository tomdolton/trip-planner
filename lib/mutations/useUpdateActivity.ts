import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateActivity } from "@/lib/api/updateActivity";

export function useUpdateActivity(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] });
    },
  });
}
