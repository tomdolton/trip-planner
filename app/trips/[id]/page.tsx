"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { TripMap } from "@/components/Map/TripMap";
import { TripMapLegend } from "@/components/Map/TripMapLegend";
import { EditEntityDialog } from "@/components/Trip/EditEntityDialog";
import { TripFooter } from "@/components/Trip/TripFooter";
import { TripHeader } from "@/components/Trip/TripHeader";
import { TripPhaseSection } from "@/components/Trip/TripPhaseSection";
import { EditTripDialog } from "@/components/TripsDashboard/EditTripDialog";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmDeleteDialog } from "@/components/ui/ConfirmDeleteDialog";
import { Skeleton } from "@/components/ui/skeleton";

import { useDeleteTrip } from "@/lib/mutations/useDeleteTrip";
import { useTripDetail } from "@/lib/queries/useTripDetail";

export default function TripDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [editing, setEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: trip, isLoading, isError } = useTripDetail(params.id as string);
  const deleteTrip = useDeleteTrip();

  if (isLoading) {
    return (
      <div className="p-8">
        <Skeleton className="mb-4 h-10 w-1/3" />
        <Skeleton className="mb-2 h-6 w-1/2" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (isError || !trip) {
    return <p className="text-center">Trip not found.</p>;
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

  // Determine if we should show the map
  const shouldShowMap = allPhases.length > 0 || unassignedLocations.length > 0;

  return (
    <div className="container py-6 md:py-7">
      {/* Trip Header - Full Width */}
      <div className="mb-6">
        <TripHeader
          trip={trip}
          onEditClick={() => setEditing(true)}
          onDeleteClick={handleDeleteClick}
        />
      </div>

      {/* Grid Layout - Single column on mobile, two columns on large screens */}
      <div
        className={`grid gap-5 ${
          shouldShowMap ? "grid-cols-1 lg:grid-cols-[clamp(20rem,50%,52rem)_1fr]" : "grid-cols-1"
        }`}
      >
        {/* Left Column: Trip Details */}
        <div className="space-y-6">
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
              allPhases={allPhases}
              phaseIndex={-1}
            />
          )}

          {/* Show all phases (including empty ones) */}
          {allPhases.map((phase, index) => (
            <TripPhaseSection
              key={phase.id}
              phase={phase}
              tripId={trip.id}
              journeys={trip.journeys}
              allPhases={allPhases}
              phaseIndex={index}
            />
          ))}

          {/* Show empty state only if no phases AND no unassigned locations */}
          {allPhases.length === 0 && unassignedLocations.length === 0 && (
            <div className="text-muted-foreground py-12 text-center">
              <h3 className="mb-2 text-lg font-medium">No content yet</h3>
              <p>
                Start by adding a phase or location to your trip using the Create New button above.
              </p>
            </div>
          )}
          {/* TripFooter: Continue your trip section at the bottom of the left column */}
          {(allPhases.length > 0 || unassignedLocations.length > 0) && <TripFooter trip={trip} />}
        </div>

        {/* Right Column: Map - Only show if there are locations */}
        {shouldShowMap && (
          <div
            className="flex flex-col gap-4 lg:sticky lg:top-4 lg:mt-4 lg:mb-4 lg:max-h-[calc(100vh-32px)] lg:min-h-[calc(100vh-32px)] lg:justify-between"
            style={{
              // 16px top and bottom margin, sticky, fit viewport
              height: "auto",
            }}
          >
            <Card className="flex min-h-[300px] flex-1 flex-col lg:h-0 lg:min-h-0 lg:grow">
              <CardContent className="flex min-h-0 flex-1 flex-col p-4">
                <div className="flex h-full flex-col">
                  <div className="min-h-[200px] flex-1 lg:min-h-0">
                    <TripMap
                      trip={trip}
                      height="100%"
                      className="h-full overflow-hidden rounded-lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="flex-shrink-0">
              <CardContent className="max-h-[216px] p-6">
                <TripMapLegend />
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Dialogs */}
      {trip && <EditTripDialog trip={trip} open={editing} onOpenChange={setEditing} />}

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

      <EditEntityDialog tripId={trip.id} phases={trip.trip_phases} trip={trip} />
    </div>
  );
}
