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
          className="relative my-6 flex-1 cursor-pointer p-6 pt-32 @md:ml-6 @md:pt-6"
          onClick={() => dispatch(openDialog({ type: "journey", entity: journey }))}
          id={`journey-${journey.id}`}
        >
          {/* Left: Main journey info */}

          {/* Mode and route */}
          <h3 className="mb-3 text-center text-xl font-semibold @md:pr-6 @md:text-start">
            <span className="text-muted-foreground block @md:me-2 @md:inline">
              {journeyModeLabels[journey.mode as keyof typeof journeyModeLabels]}:
            </span>
            {departureLocationName} → {arrivalLocationName}
          </h3>

          {/* Departure date */}
          <div className="text-muted-foreground mb-6 flex justify-center gap-3 text-sm font-medium @md:justify-start">
            {journey.departure_time && <span>{format(journey.departure_time, "d MMM y")}</span>}

            {journey.departure_time && journey.provider && "|"}

            {journey.provider && <span>{journey.provider}</span>}
          </div>

          <div className="flex flex-col justify-between gap-6 @xl:flex-row">
            <div className="flex shrink-0 items-start gap-6">
              {/* Times and locations with vertical line */}
              <div className="before:bg-border relative flex w-full flex-col items-start justify-between gap-7 before:absolute before:top-4 before:bottom-4 before:left-1/2 before:w-px @md:before:left-2 @md:before:w-0.5">
                {/* Top: Departure */}
                <JourneyTimePlaceRow
                  time={journey.departure_time}
                  placeName={journey.departure_place?.name}
                />

                {/* Duration badge */}
                {duration && (
                  <Badge
                    variant="secondary"
                    className="relative mx-auto text-xs font-normal @md:mr-0 @md:ml-9"
                  >
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
              <div className="text-muted-foreground flex-1 rounded-md border p-4 text-sm">
                {journey.notes}
              </div>
            )}
          </div>

          {/* Action Menu (top right) */}
          <ActionMenu className="absolute top-4 right-4">
            <ActionMenuItem onSelect={handleEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </ActionMenuItem>
            <ActionMenuSeparator />
            <ActionMenuItem
              onSelect={handleDelete}
              disabled={deleteJourney.isPending}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
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
