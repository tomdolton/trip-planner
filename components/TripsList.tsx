'use client';

import { useTrips } from '@/lib/queries/useTrips';

export default function TripsList() {
  const { data: trips, isLoading, error } = useTrips();

  if (isLoading) return <p>Loading trips...</p>;
  if (error) return <p className="text-red-600">{error.message}</p>;

  return (
    <ul className="space-y-2">
      {trips?.map((trip) => (
        <li key={trip.id} className="p-4 border rounded shadow">
          <h3 className="font-bold">{trip.name}</h3>
          <p>
            {trip.start_date} → {trip.end_date}
          </p>
          {trip.notes && <p className="text-sm italic">{trip.notes}</p>}
        </li>
      ))}
    </ul>
  );
}
