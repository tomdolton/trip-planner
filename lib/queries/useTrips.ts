import { useQuery } from '@tanstack/react-query';
import { createSupabaseClient } from '../supabase';
import { useUser } from '@/hooks/useUser';

export function useTrips() {
  const supabase = createSupabaseClient();
  const { user } = useUser();

  return useQuery({
    queryKey: ['trips', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    },
  });
}
