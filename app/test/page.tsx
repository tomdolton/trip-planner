'use client';

import { useEffect, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase';
import { useUser } from '@/hooks/useUser';

export default function SupabaseTest() {
  const [data, setData] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  const supabase = createSupabaseClient();

  useEffect(() => {
    async function fetchTrips() {
      const { data, error } = await supabase.from('trips').select('*');
      if (error) setError(error.message);
      else setData(data);
    }
    fetchTrips();
  }, []);

  return (
    <div>
      <h1>Test Supabase Connection</h1>
      {error && <p className="text-red-500">Error: {error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      {JSON.stringify(user, null, 2)}
    </div>
  );
}
