"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import EditTripForm from "@/components/TripsDashboard/EditTripForm";
import { Skeleton } from "@/components/ui/skeleton";
import { useTripDetail } from "@/lib/queries/useTripDetail";
import { AddPhaseForm } from "@/components/Trip/AddPhaseForm";
import { TripPhaseSection } from "@/components/Trip/TripPhaseSection";
import { TripHeader } from "@/components/Trip/TripHeader";

export default function TripDetailPage() {
  const { id } = useParams();
  const [editing, setEditing] = useState(false);

  const { data: trip, isLoading, isError } = useTripDetail(id as string);

  if (isLoading) {
    return (
      <div className="p-8">
        <Skeleton className="h-10 w-1/3 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-2" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (isError) {
    return <p className="text-center text-red-500">Trip not found.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-6">
      <TripHeader trip={trip} onEditClick={() => setEditing(true)} />

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
    </div>
  );
}
