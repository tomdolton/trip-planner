import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteActivity } from "@/lib/api/deleteActivity";

export function useDeleteActivity(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] });
    },
  });
}
