"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Trip } from "@/types/trip";

import { TripImage } from "@/components/Trip/TripImage";
import { AddTripDialog } from "@/components/TripsDashboard/AddTripDialog";
import { EditTripDialog } from "@/components/TripsDashboard/EditTripDialog";
import NewTripCard from "@/components/TripsDashboard/NewTripCard";
import { ActionMenu, ActionMenuItem, ActionMenuSeparator } from "@/components/ui/ActionMenu";
import { ConfirmDeleteDialog } from "@/components/ui/ConfirmDeleteDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { TripItemCard } from "@/components/ui/TripItemCard";

import { useDeleteTrip } from "@/lib/mutations/useDeleteTrip";
import { useTrips } from "@/lib/queries/useTrips";
import { formatDateRange } from "@/lib/utils/dateTime";
import { filterTrips, sortTrips } from "@/lib/utils/tripListUtils";

import { TripsFilter } from "./TripsFilterTabs";

type TripsListProps = {
  filter?: TripsFilter;
};

export default function TripsList({ filter = "upcoming" }: TripsListProps) {
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);
  const [openNewTrip, setOpenNewTrip] = useState(false);

  const { data: trips, isLoading, isError } = useTrips();
  const deleteTrip = useDeleteTrip();
  const router = useRouter();

  const now = new Date();
  const filteredTrips = trips ? sortTrips(filterTrips(trips, filter, now)) : [];

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
      <div className="grid w-full max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <p className="text-destructive text-center">Failed to load trips.</p>;
  }

  if (!filteredTrips || filteredTrips.length === 0) {
    return (
      <div className="text-muted-foreground rounded-md border p-6 text-center">
        <p>No trips found. Add one to get started!</p>
      </div>
    );
  }

  return (
    <>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <li>
          <NewTripCard onClick={() => setOpenNewTrip(true)} className="h-full" />
        </li>
        {filteredTrips.map((trip) => (
          <TripItemCard
            key={trip.id}
            onClick={() => router.push(`/trips/${trip.id}`)}
            className="cursor-pointer p-6 pb-14"
            hoverEffect
          >
            <TripImage
              trip={trip}
              className="mb-8 h-40 w-full overflow-hidden rounded-xl lg:h-58"
              showAttribution={true}
              hasBackgroundLink={false}
            />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-card-foreground text-xl font-semibold">{trip.title}</h2>
                <ActionMenu>
                  <ActionMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      setEditingTrip(trip);
                    }}
                  >
                    <Pencil className="mr-2 size-4" />
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
                    <Trash2 className="mr-2 size-4" />
                    Delete
                  </ActionMenuItem>
                </ActionMenu>
              </div>

              <p className="text-muted-foreground font-semibold">
                {formatDateRange(trip.start_date, trip.end_date)}
              </p>

              {trip.description && <p className="text-muted-foreground">{trip.description}</p>}
            </div>
          </TripItemCard>
        ))}
      </ul>

      {/* Create Trip Dialog */}
      <AddTripDialog open={openNewTrip} onOpenChange={setOpenNewTrip} />

      {editingTrip && (
        <EditTripDialog
          trip={editingTrip}
          open={!!editingTrip}
          onOpenChange={(open) => {
            if (!open) setEditingTrip(null);
          }}
        />
      )}

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
