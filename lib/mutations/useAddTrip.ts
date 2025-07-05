// lib/mutations/useAddTrip.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { TripFormValues } from '@/types/forms';
import { toast } from 'sonner';

export function useAddTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTrip: TripFormValues) => {
      const { data, error } = await supabase.from('trips').insert(newTrip).select().single();
      if (error) throw new Error(error.message);
      return data;
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
