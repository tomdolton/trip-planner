'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getTripById } from '@/lib/queries/getTripById';
import { Trip } from '@/types/trip';
import { format, parseISO } from 'date-fns';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import EditTripForm from '@/components/EditTripForm';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function TripDetailPage() {
  const { id } = useParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchTrip = async () => {
      try {
        const tripData = await getTripById(id as string);
        setTrip(tripData);
      } catch (err) {
        console.error('Failed to fetch trip', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrip();
  }, [id]);

  if (isLoading) {
    return (
      <div className="p-8">
        <Skeleton className="h-10 w-1/3 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-2" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!trip) {
    return <p className="text-center text-red-500">Trip not found.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-6">
      <Link
        href="/trips"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:underline"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to trips
      </Link>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{trip.name}</h1>
        <Button variant="outline" onClick={() => setEditing(true)}>
          Edit
        </Button>
      </div>

      <p className="text-muted-foreground">
        {trip.start_date && trip.end_date
          ? `${format(parseISO(trip.start_date), 'dd MMM yyyy')} - ${format(parseISO(trip.end_date), 'dd MMM yyyy')}`
          : 'No dates specified'}
      </p>

      {trip.notes && (
        <div>
          <h2 className="text-lg font-semibold mb-1">Notes</h2>
          <p className="whitespace-pre-line">{trip.notes}</p>
        </div>
      )}

      <Dialog open={editing} onOpenChange={(open) => setEditing(open)}>
        <DialogContent>
          <EditTripForm trip={trip} onClose={() => setEditing(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
