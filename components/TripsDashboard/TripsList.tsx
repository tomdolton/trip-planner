"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Trip } from "@/types/trip";

import EditTripForm from "@/components/TripsDashboard/EditTripForm";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

import { useDeleteTrip } from "@/lib/mutations/useDeleteTrip";
import { useTrips } from "@/lib/queries/useTrips";
import { formatDateRange } from "@/lib/utils/formatDateRange";

export default function TripList() {
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);

  const { data: trips, isLoading, isError } = useTrips();
  const deleteTrip = useDeleteTrip();

  const router = useRouter();

  const confirmDelete = () => {
    if (!tripToDelete) return;
    deleteTrip.mutate(tripToDelete.id, {
      onSuccess: () => toast.success("Trip deleted"),
      onError: (err) =>
        toast.error("Failed to delete trip", {
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
          <Card
            key={trip.id}
            onClick={() => router.push(`/trips/${trip.id}`)}
            className="cursor-pointer hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{trip.title}</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>{formatDateRange(trip.start_date, trip.end_date)}</p>
              {trip.description && <p>{trip.description}</p>}
            </CardContent>

            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingTrip(trip);
                }}
              >
                <Pencil className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setTripToDelete(trip);
                }}
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
              Are you sure you want to delete <strong>{tripToDelete?.title}</strong>?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All data associated with this trip will be permanently
              deleted.
            </AlertDialogDescription>
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
