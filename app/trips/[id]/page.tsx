"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { AddPhaseForm } from "@/components/Trip/AddPhaseForm";
import { EditEntityDialog } from "@/components/Trip/EditEntityDialog";
import { TripHeader } from "@/components/Trip/TripHeader";
import { TripPhaseSection } from "@/components/Trip/TripPhaseSection";
import EditTripForm from "@/components/TripsDashboard/EditTripForm";
import { ConfirmDeleteDialog } from "@/components/ui/ConfirmDeleteDialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

import { useDeleteTrip } from "@/lib/mutations/useDeleteTrip";
import { useTripDetail } from "@/lib/queries/useTripDetail";

export default function TripDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [editing, setEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: trip, isLoading, isError } = useTripDetail(id as string);
  const deleteTrip = useDeleteTrip();

  if (isLoading) {
    return (
      <div className="p-8">
        <Skeleton className="h-10 w-1/3 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-2" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (isError || !trip) {
    return <p className="text-center text-red-500">Trip not found.</p>;
  }

  const handleDeleteClick = () => setShowDeleteDialog(true);

  const confirmDelete = () => {
    if (!trip) return;
    deleteTrip.mutate(trip.id, {
      onSuccess: () => {
        toast.success("Trip deleted");
        router.push("/trips"); // Use Next.js router for redirect
      },
      onError: (err) =>
        toast.error("Failed to delete trip", {
          description: (err as Error).message,
        }),
    });
    setShowDeleteDialog(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-6">
      <TripHeader
        trip={trip}
        onEditClick={() => setEditing(true)}
        onDeleteClick={handleDeleteClick}
      />

      <div className="mt-8">
        <AddPhaseForm tripId={trip.id} />
      </div>

      {trip?.trip_phases?.map((phase) => (
        <TripPhaseSection key={phase.id} phase={phase} tripId={trip.id} />
      ))}

      {Array.isArray(trip?.journeys) && trip.journeys.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <h2 className="text-xl font-bold">Journeys</h2>
          {trip.journeys.map((j) => (
            <p key={j.id} className="text-sm text-muted-foreground">
              ✈️ {j.mode} from {j.departure_location_id} to {j.arrival_location_id}
            </p>
          ))}
        </div>
      )}

      {trip && (
        <Dialog open={editing} onOpenChange={(open) => setEditing(open)}>
          <DialogContent>
            <EditTripForm trip={trip} onClose={() => setEditing(false)} />
          </DialogContent>
        </Dialog>
      )}

      <ConfirmDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title={
          <>
            Are you sure you want to delete <strong>{trip?.title}</strong>?
          </>
        }
        description="This action cannot be undone. All data associated with this trip will be permanently deleted."
        onConfirm={confirmDelete}
        loading={deleteTrip.isPending}
      />

      <EditEntityDialog tripId={trip.id} />
    </div>
  );
}
