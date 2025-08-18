"use client";

import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";

import { Journey } from "@/types/trip";

import { ActionMenu, ActionMenuItem, ActionMenuSeparator } from "@/components/ui/ActionMenu";
import { Badge } from "@/components/ui/badge";
import { ConfirmDeleteDialog } from "@/components/ui/ConfirmDeleteDialog";
import { TripItemCard } from "@/components/ui/TripItemCard";

import { JourneyMode, journeyModeLabels } from "@/lib/constants/journeyModes";
import { useDeleteJourney } from "@/lib/mutations/useDeleteJourney";
import { getDuration } from "@/lib/utils/dateTime";
import { isStartJourney, isEndJourney } from "@/lib/utils/journeyUtils";

import { openDialog } from "@/store/uiDialogSlice";

import { JourneyTimeline } from "./JourneyTimeline";
import { JourneyTimePlaceRow } from "./JourneyTimePlaceRow";

interface JourneyDetailsProps {
  journey: Journey;
  tripId: string;
  departureLocationName?: string;
  arrivalLocationName?: string;
}

export function JourneyDetails({
  journey,
  tripId,
  departureLocationName,
  arrivalLocationName,
}: JourneyDetailsProps) {
  const dispatch = useDispatch();
  const deleteJourney = useDeleteJourney(tripId);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  function handleEdit(e: Event) {
    e.stopPropagation();
    dispatch(openDialog({ type: "journey", entity: journey }));
  }

  function handleDelete(e: Event) {
    e.stopPropagation();
    setShowDeleteDialog(true);
  }

  function confirmDelete() {
    deleteJourney.mutate({ id: journey.id });
    setShowDeleteDialog(false);
  }

  const duration = getDuration(journey.departure_time, journey.arrival_time);

  // Determine if this is a start or end journey
  const isStart = isStartJourney(journey);
  const isEnd = isEndJourney(journey);

  return (
    <>
      <JourneyTimeline
        mode={journey.mode as JourneyMode}
        showUpwardLine={!isStart}
        showDownwardLine={!isEnd}
      >
        <TripItemCard
          className="ml-4 md:ml-6 my-6 p-6 flex-1 relative cursor-pointer @container"
          hoverEffect
          onClick={() => dispatch(openDialog({ type: "journey", entity: journey }))}
        >
          {/* Left: Main journey info */}

          {/* Mode and route */}
          <h3 className="font-semibold text-xl mb-3 pr-6">
            <span className="text-muted-foreground me-2">
              {journeyModeLabels[journey.mode as keyof typeof journeyModeLabels]}:
            </span>
            {departureLocationName} → {arrivalLocationName}
          </h3>

          {/* Departure date */}
          <div className="flex gap-3 text-muted-foreground text-sm font-medium mb-6">
            {journey.departure_time && <span>{format(journey.departure_time, "d MMM y")}</span>}

            {journey.departure_time && journey.provider && "|"}

            {journey.provider && <span>{journey.provider}</span>}
          </div>

          <div className="flex flex-col @lg:flex-row justify-between gap-6">
            <div className="flex items-start gap-6 shrink-0">
              {/* Times and locations with vertical line */}
              <div className="flex flex-col items-start justify-between gap-7 relative before:w-0.5 before:top-4 before:bottom-4 before:bg-border before:absolute before:left-2">
                {/* Top: Departure */}
                <JourneyTimePlaceRow
                  time={journey.departure_time}
                  placeName={journey.departure_place?.name}
                />

                {/* Duration badge */}
                {duration && (
                  <Badge variant="secondary" className="ml-9 font-normal text-xs">
                    Duration: {duration}
                  </Badge>
                )}

                {/* Bottom: Arrival */}
                <JourneyTimePlaceRow
                  time={journey.arrival_time}
                  placeName={journey.arrival_place?.name}
                />
              </div>
            </div>

            {/* Right: Notes box */}
            {journey.notes && (
              <div className="border rounded-md p-4 text-muted-foreground text-sm flex-1">
                {journey.notes}
              </div>
            )}
          </div>

          {/* Action Menu (top right) */}
          <ActionMenu className="absolute top-4 right-4">
            <ActionMenuItem onSelect={handleEdit}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </ActionMenuItem>
            <ActionMenuSeparator />
            <ActionMenuItem
              onSelect={handleDelete}
              disabled={deleteJourney.isPending}
              className="text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </ActionMenuItem>
          </ActionMenu>
        </TripItemCard>
      </JourneyTimeline>

      <ConfirmDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title={`Delete "${journey.provider || "this journey"}"?`}
        description="This action cannot be undone. All data associated with this journey will be permanently deleted."
        onConfirm={confirmDelete}
        loading={deleteJourney.isPending}
      />
    </>
  );
}
