import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Trip } from "@/types/trip";

export function useDeleteTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tripId: string) => {
      const { error } = await supabase.from("trips").delete().eq("id", tripId);
      if (error) throw new Error(error.message);
    },
    onMutate: async (tripId) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["trips"] });

      // Snapshot the previous value
      const previousTrips = queryClient.getQueryData<Trip[]>(["trips"]);

      // Optimistically remove the deleted trip from the UI
      queryClient.setQueryData(["trips"], (old: Trip[] | undefined) =>
        old?.filter((trip) => trip.id !== tripId)
      );

      // Return context for rollback
      return { previousTrips };
    },
    onError: (_err, _id, context) => {
      // Rollback to the previous value in case of error
      if (context?.previousTrips) {
        queryClient.setQueryData(["trips"], context.previousTrips);
      }
    },
    onSettled: () => {
      // Invalidate the trips query to refetch data
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
  });
}
