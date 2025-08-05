"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

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
        router.push("/trips");
      },
      onError: (err) =>
        toast.error("Failed to delete trip", {
          description: (err as Error).message,
        }),
    });
    setShowDeleteDialog(false);
  };

  // Get locations not assigned to any phase from the dedicated field
  const unassignedLocations = trip.unassigned_locations ?? [];

  // Show ALL phases, even if they're empty
  const allPhases = trip.trip_phases ?? [];

  return (
    <div className="container py-8 space-y-6">
      <TripHeader
        trip={trip}
        onEditClick={() => setEditing(true)}
        onDeleteClick={handleDeleteClick}
      />

      {/* Always show unassigned locations section if there are any */}
      {unassignedLocations.length > 0 && (
        <TripPhaseSection
          phase={{
            id: "no-phase",
            trip_id: trip.id,
            title: "Locations",
            description: "Locations not assigned to any phase",
            locations: unassignedLocations,
          }}
          tripId={trip.id}
          journeys={trip.journeys}
          isNoPhaseSection={true}
        />
      )}

      {/* Show all phases (including empty ones) */}
      {allPhases.map((phase) => (
        <TripPhaseSection key={phase.id} phase={phase} tripId={trip.id} journeys={trip.journeys} />
      ))}

      {/* Show empty state only if no phases AND no unassigned locations */}
      {allPhases.length === 0 && unassignedLocations.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <h3 className="text-lg font-medium mb-2">No content yet</h3>
          <p>Start by adding a phase or location to your trip using the Create New button above.</p>
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
