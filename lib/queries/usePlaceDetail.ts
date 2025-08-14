import { useQuery } from "@tanstack/react-query";

import { Place } from "@/types/trip";

import { supabase } from "@/lib/supabase";

export function usePlaceDetail(placeId: string | null | undefined) {
  return useQuery<Place | null>({
    queryKey: ["place", placeId],
    queryFn: async () => {
      if (!placeId) return null;

      const { data, error } = await supabase
        .from("places")
        .select("*")
        .eq("id", placeId)
        .maybeSingle();

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!placeId,
  });
}
