'use client';

import TripsList from '@/components/TripsList';

export default function TripsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-3xl font-bold text-center mb-8 font-serif">Trips Page</h1>
      <p className="text-lg text-center">This is the trips page. You can manage your trips here.</p>

      <TripsList />
    </div>
  );
}
