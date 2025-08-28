"use client";

import { MapPin, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";

import { Location } from "@/types/trip";

import { ActionMenu, ActionMenuItem, ActionMenuSeparator } from "@/components/ui/ActionMenu";
import { ConfirmDeleteDialog } from "@/components/ui/ConfirmDeleteDialog";

import { useDeleteLocation } from "@/lib/mutations/useDeleteLocation";
import { getLocationDateRange } from "@/lib/utils";

import { openDialog } from "@/store/uiDialogSlice";

import { AccommodationsList } from "./AccommodationsList";
import { LocationActions } from "./LocationActions";
import { TripActivities } from "./TripActivities";

interface LocationCardProps {
  location: Location;
  tripId: string;
}

export function LocationCard({ location, tripId }: LocationCardProps) {
  const dispatch = useDispatch();
  const deleteLocation = useDeleteLocation(tripId);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const dateRange = getLocationDateRange(location);

  function handleEdit() {
    dispatch(openDialog({ type: "location", entity: location }));
  }

  function handleDelete() {
    setShowDeleteDialog(true);
  }

  function confirmDelete() {
    deleteLocation.mutate({ id: location.id });
    setShowDeleteDialog(false);
  }

  return (
    <>
      <div
        className="card relative space-y-6 p-4 md:space-y-10 @md:p-6"
        id={`location-${location.id}`}
      >
        {/* Header with action menu */}
        <div className="flex items-start justify-between">
          <div
            onClick={() => dispatch(openDialog({ type: "location", entity: location }))}
            className="flex-1 cursor-pointer rounded text-center @sm:text-start"
          >
            <span className="bg-secondary mb-6 inline-flex rounded-xl p-2">
              <MapPin className="size-8" strokeWidth={1} />
            </span>

            <div className="space-y-3">
              <h3 className="cursor-pointer text-2xl font-semibold">{location.name}</h3>

              <div className="text-muted-foreground font-semibold">
                {dateRange || "No dates scheduled"}
              </div>

              {location.notes && (
                <p className="text-muted-foreground text-sm @sm:text-base">{location.notes}</p>
              )}
            </div>
          </div>

          {/* Action Menu */}
          <ActionMenu className="absolute top-4 right-4 @sm:static">
            <ActionMenuItem onSelect={handleEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </ActionMenuItem>
            <ActionMenuSeparator />
            <ActionMenuItem
              onSelect={handleDelete}
              disabled={deleteLocation.isPending}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </ActionMenuItem>
          </ActionMenu>
        </div>

        <LocationActions tripId={tripId} locationId={location.id} />

        {location.accommodations && location.accommodations.length > 0 && (
          <AccommodationsList accommodations={location.accommodations ?? []} tripId={tripId} />
        )}

        {location.activities && location.activities.length > 0 && (
          <TripActivities activities={location.activities ?? []} tripId={tripId} />
        )}
      </div>

      <ConfirmDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title={`Delete "${location.name}"?`}
        description="This action cannot be undone. All data associated with this location will be permanently deleted."
        onConfirm={confirmDelete}
        loading={deleteLocation.isPending}
      />
    </>
  );
}
