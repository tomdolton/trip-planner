// lib/mutations/useAddTrip.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { TripFormValues } from '@/types/forms';
import { toast } from 'sonner';
import { useUser } from '@/hooks/useUser';

export function useAddTrip() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: async (trip: TripFormValues) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase.from('trips').insert([
        {
          ...trip,
          user_id: user.id,
          start_date: trip.start_date || null,
          end_date: trip.end_date || null,
          description: trip.description || null,
        },
      ]);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success('Trip added successfully!');
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
    onError: (err: Error) => {
      toast.error('Error adding trip', {
        description: err.message,
      });
    },
  });
}
