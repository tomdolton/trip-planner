import { useQuery } from "@tanstack/react-query";
import { getTripById } from "@/lib/api/getTripById";

export function useTripDetail(tripId?: string) {
  return useQuery({
    queryKey: ["trip", tripId],
    queryFn: () => getTripById(tripId!),
    enabled: !!tripId,
  });
}
