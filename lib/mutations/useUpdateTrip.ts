import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSupabaseClient } from '@/lib/supabase';
import { Trip } from '@/types/trip';
import { TripFormValues } from '@/types/forms';

export function useUpdateTrip() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, TripFormValues & { id: string }, { previousTrips?: Trip[] }>({
    mutationFn: async ({ id, ...data }) => {
      const supabase = createSupabaseClient();
      const { error } = await supabase.from('trips').update(data).eq('id', id);
      if (error) throw new Error(error.message);
    },
    onMutate: async (updatedTrip) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['trips'] });

      // Snapshot the previous value
      const previousTrips = queryClient.getQueryData<Trip[]>(['trips']);

      // Optimistically update the trip in the UI
      queryClient.setQueryData<Trip[]>(['trips'], (old) =>
        old?.map((trip) => (trip.id === updatedTrip.id ? { ...trip, ...updatedTrip } : trip))
      );

      // Return context for rollback
      return { previousTrips };
    },
    onError: (_err, _updatedTrip, context) => {
      // Rollback to the previous value in case of error
      if (context?.previousTrips) {
        queryClient.setQueryData(['trips'], context.previousTrips);
      }
    },
    onSettled: () => {
      // Invalidate the trips query to refetch data
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });
}
