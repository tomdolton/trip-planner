"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import type { Trip, TripPhase, Location } from "@/types/trip";

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

  function getAllLocations(trip: Trip): Location[] {
    return trip.trip_phases?.flatMap((phase: TripPhase) => phase.locations ?? []) ?? [];
  }

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

  return (
    <div className="container py-8 space-y-6">
      <TripHeader
        trip={trip}
        onEditClick={() => setEditing(true)}
        onDeleteClick={handleDeleteClick}
      />

      {trip.trip_phases?.length ? (
        trip.trip_phases.map((phase) => (
          <TripPhaseSection
            key={phase.id}
            phase={phase}
            tripId={trip.id}
            journeys={trip.journeys}
          />
        ))
      ) : (
        <TripPhaseSection
          phase={{
            id: "no-phase",
            trip_id: trip.id,
            title: "All Locations",
            locations: getAllLocations(trip),
          }}
          tripId={trip.id}
          journeys={trip.journeys}
        />
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
