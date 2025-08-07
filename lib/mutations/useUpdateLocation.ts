import { useMutation, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";

export function useUpdateLocation(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: {
      id: string;
      name: string;
      region?: string; // Will be automatically set from Google Place data
      notes?: string;
      phaseId?: string;
    }) => {
      const { data, error } = await supabase
        .from("locations")
        .update({
          name: values.name,
          region: values.region || null,
          notes: values.notes || null,
          trip_phase_id: values.phaseId || null,
        })
        .eq("id", values.id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] });
    },
  });
}
