import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateAccommodation } from "@/lib/api/updateAccommodation";

export function useUpdateAccommodation(tripId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAccommodation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] });
    },
  });
}
