import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateLocation } from "@/lib/api/updateLocation";

export function useUpdateLocation(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] });
    },
  });
}
