'use client';

import { createSupabaseClient } from '@/lib/supabase';

export default function LogoutButton() {
  const supabase = createSupabaseClient();

  return (
    <button
      className="btn cursor-pointer bg-white text-black px-4 py-2 rounded "
      onClick={async () => {
        await supabase.auth.signOut();
        window.location.reload();
      }}
    >
      Log Out
    </button>
  );
}
