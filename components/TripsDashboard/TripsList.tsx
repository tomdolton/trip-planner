"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Trip } from "@/types/trip";

import EditTripForm from "@/components/TripsDashboard/EditTripForm";
import { ActionMenu, ActionMenuItem, ActionMenuSeparator } from "@/components/ui/ActionMenu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDeleteDialog } from "@/components/ui/ConfirmDeleteDialog";
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
                <ActionMenu>
                  <ActionMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      setEditingTrip(trip);
                    }}
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </ActionMenuItem>
                  <ActionMenuSeparator />
                  <ActionMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      setTripToDelete(trip);
                    }}
                    disabled={deleteTrip.isPending}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </ActionMenuItem>
                </ActionMenu>
              </CardTitle>
            </CardHeader>

            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>{formatDateRange(trip.start_date, trip.end_date)}</p>
              {trip.description && <p>{trip.description}</p>}
            </CardContent>
          </Card>
        ))}
      </ul>

      <Dialog open={!!editingTrip} onOpenChange={(open) => !open && setEditingTrip(null)}>
        <DialogContent>
          {editingTrip && <EditTripForm trip={editingTrip} onClose={() => setEditingTrip(null)} />}
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!tripToDelete}
        onOpenChange={(open) => !open && setTripToDelete(null)}
        title={
          <>
            Are you sure you want to delete <strong>{tripToDelete?.title}</strong>?
          </>
        }
        description="This action cannot be undone. All data associated with this trip will be permanently deleted."
        onConfirm={confirmDelete}
        loading={deleteTrip.isPending}
      />
    </>
  );
}
