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
      <div className="card p-6 space-y-10" id={`location-${location.id}`}>
        {/* Header with action menu */}
        <div className="flex items-start justify-between">
          <div
            onClick={() => dispatch(openDialog({ type: "location", entity: location }))}
            className="cursor-pointer rounded flex-1"
          >
            <span className="inline-flex p-2 bg-secondary rounded-xl mb-6">
              <MapPin className="size-8" strokeWidth={1} />
            </span>

            <div className="space-y-3">
              <h3 className="text-2xl font-semibold cursor-pointer">{location.name}</h3>

              <div className="font-semibold text-muted-foreground">
                {dateRange || "No dates scheduled"}
              </div>

              {location.notes && <p className="text-muted-foreground">{location.notes}</p>}
            </div>
          </div>

          {/* Action Menu */}
          <ActionMenu>
            <ActionMenuItem onSelect={handleEdit}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </ActionMenuItem>
            <ActionMenuSeparator />
            <ActionMenuItem
              onSelect={handleDelete}
              disabled={deleteLocation.isPending}
              className="text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </ActionMenuItem>
          </ActionMenu>
        </div>

        <LocationActions tripId={tripId} locationId={location.id} />

        <AccommodationsList accommodations={location.accommodations ?? []} tripId={tripId} />

        <TripActivities activities={location.activities ?? []} tripId={tripId} />
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
