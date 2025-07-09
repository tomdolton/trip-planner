import { useQuery } from "@tanstack/react-query";

import { useUser } from "@/hooks/useUser";

import { supabase } from "../supabase";

export function useTrips() {
  const { user } = useUser();

  return useQuery({
    queryKey: ["trips", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
  });
}
