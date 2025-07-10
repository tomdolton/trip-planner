import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addAccommodation } from "@/lib/api/addAccommodation";

// import { useUser } from "@/hooks/useUser";

export function useAddAccommodation(tripId: string) {
  const queryClient = useQueryClient();
  // const { user } = useUser();

  return useMutation({
    mutationFn: async (values: {
      locationId: string;
      name: string;
      check_in?: string;
      check_out?: string;
      notes?: string;
      url?: string;
    }) => {
      // if (!user?.id) throw new Error("User not logged in");
      return addAccommodation({ ...values, tripId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] });
    },
  });
}
