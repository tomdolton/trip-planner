'use client';

import { useState } from 'react';
import { useTrips } from '@/lib/queries/useTrips';
import { useDeleteTrip } from '@/lib/mutations/useDeleteTrip';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import EditTripForm from '@/components/EditTripForm';
import { Trip } from '@/types/trip';
import { toast } from 'sonner';

export default function TripList() {
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);

  const { data: trips, isLoading, isError } = useTrips();

  const deleteTrip = useDeleteTrip();

  const confirmDelete = () => {
    if (!tripToDelete) return;
    deleteTrip.mutate(tripToDelete.id, {
      onSuccess: () => toast.success('Trip deleted'),
      onError: (err) =>
        toast.error('Failed to delete trip', {
          description: (err as Error).message,
        }),
    });
    setTripToDelete(null);
  };

  if (isLoading) return <p className="text-center">Loading trips...</p>;
  if (isError) return <p className="text-center text-red-500">Failed to load trips.</p>;
  if (!trips || trips.length === 0) return <p className="text-center">No trips found.</p>;

  return (
    <>
      <ul>
        {trips.map((trip) => (
          <li key={trip.id} className="flex justify-between items-center p-4 border-b">
            <div>
              <h3 className="font-semibold">{trip.name}</h3>
              <p>
                {trip.start_date} – {trip.end_date}
              </p>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-outline" onClick={() => setEditingTrip(trip)}>
                Edit
              </button>
              <button
                className="btn btn-destructive"
                onClick={() => setTripToDelete(trip)}
                disabled={deleteTrip.isPending}
              >
                {deleteTrip.isPending && tripToDelete?.id === trip.id ? (
                  <span className="flex items-center gap-1">
                    <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </span>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </li>
        ))}
      </ul>

      <Dialog open={!!editingTrip} onOpenChange={(open) => !open && setEditingTrip(null)}>
        <DialogContent>
          {editingTrip && <EditTripForm trip={editingTrip} onClose={() => setEditingTrip(null)} />}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!tripToDelete} onOpenChange={(open) => !open && setTripToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete <strong>{tripToDelete?.name}</strong>?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={deleteTrip.isPending}>
              Yes, delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
