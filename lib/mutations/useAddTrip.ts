import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSupabaseClient } from '../supabase';
import { TripFormValues } from '@/types/forms';
import { useUser } from '@/hooks/useUser';

export function useAddTrip() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: async (trip: TripFormValues) => {
      if (!user) throw new Error('User not authenticated');
      const supabase = createSupabaseClient();

      const { error } = await supabase.from('trips').insert([
        {
          ...trip,
          user_id: user.id,
          start_date: trip.start_date || null,
          end_date: trip.end_date || null,
          notes: trip.notes || null,
        },
      ]);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      // Refresh trip list after adding
      queryClient.invalidateQueries({ queryKey: ['trips', user?.id] });
    },
  });
}
