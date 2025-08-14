import { useMutation, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";

export function useUpdateJourney(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    {
      id: string;
      provider?: string;
      mode: string;
      departure_time?: string;
      arrival_time?: string;
      notes?: string;
      departure_place_id?: string | null;
      arrival_place_id?: string | null;
    }
  >({
    mutationFn: async ({ id, ...data }) => {
      const { error } = await supabase.from("journeys").update(data).eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] });
    },
  });
}
