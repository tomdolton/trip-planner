import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { TripFormValues } from '@/types/forms';

export function useUpdateTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TripFormValues & { id: string }) => {
      const { error } = await supabase
        .from('trips')
        .update({
          name: data.name,
          start_date: data.start_date,
          end_date: data.end_date,
          notes: data.notes,
        })
        .eq('id', data.id);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });
}
