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
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import EditTripForm from '@/components/EditTripForm';
import { Trip } from '@/types/trip';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';

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

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <p className="text-center text-red-500">Failed to load trips.</p>;
  }

  if (!trips || trips.length === 0) {
    return (
      <div className="text-center text-muted-foreground border rounded-md p-6">
        <p>No trips found. Add one to get started!</p>
      </div>
    );
  }

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl">
        {trips.map((trip) => (
          <Card key={trip.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{trip.name}</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                {trip.start_date && trip.end_date ? (
                  <>
                    {format(parseISO(trip.start_date), 'dd MMM yyyy')} –{' '}
                    {format(parseISO(trip.end_date), 'dd MMM yyyy')}
                  </>
                ) : (
                  'No date set'
                )}
              </p>
              {trip.notes && <p>{trip.notes}</p>}
            </CardContent>

            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditingTrip(trip)}>
                <Pencil className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setTripToDelete(trip)}
                disabled={deleteTrip.isPending}
              >
                {deleteTrip.isPending && tripToDelete?.id === trip.id ? (
                  <span className="flex items-center gap-1">
                    <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </span>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
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
