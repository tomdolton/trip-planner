import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteLocation } from "@/lib/api/deleteLocation";

export function useDeleteLocation(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] });
    },
  });
}
