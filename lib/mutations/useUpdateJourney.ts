import { useMutation, useQueryClient } from "@tanstack/react-query";

import { JourneyFormValues } from "@/types/forms";

import { supabase } from "@/lib/supabase";

export function useUpdateJourney(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, JourneyFormValues & { id: string }>({
    mutationFn: async ({ id, ...data }) => {
      const { error } = await supabase.from("journeys").update(data).eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] });
    },
  });
}
