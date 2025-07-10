import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteAccommodation } from "@/lib/api/deleteAccommodation";

export function useDeleteAccommodation(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAccommodation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] });
    },
  });
}
