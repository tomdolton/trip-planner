"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";

import { Journey } from "@/types/trip";

import { ActionMenu, ActionMenuItem, ActionMenuSeparator } from "@/components/ui/ActionMenu";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmDeleteDialog } from "@/components/ui/ConfirmDeleteDialog";

import { JourneyMode, journeyModeLabels } from "@/lib/constants/journeyModes";
import { useDeleteJourney } from "@/lib/mutations/useDeleteJourney";
import { formatDateTime } from "@/lib/utils/formatDateTime";
import { getDuration } from "@/lib/utils/getDuration";
import { isStartJourney, isEndJourney } from "@/lib/utils/journeyUtils";

import { openDialog } from "@/store/uiDialogSlice";

import { JourneyTimeline } from "./JourneyTimeline";

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
        {/* Journey Card - indented to the right */}
        <Card className="ml-4 md:ml-6 my-8 flex-1 border border-border shadow-none">
          <CardContent className="p-4">
            <div
              onClick={() => dispatch(openDialog({ type: "journey", entity: journey }))}
              className="cursor-pointer space-y-4"
            >
              {/* Journey Type and Provider */}
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">
                  Journey: {journeyModeLabels[journey.mode as keyof typeof journeyModeLabels]}
                  {duration && (
                    <span className="text-sm font-normal text-muted-foreground ml-4 lg:ml-15">
                      Duration: {duration}
                    </span>
                  )}
                </h3>

                {/* Action Menu */}
                <ActionMenu>
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
              </div>

              {/* Departure and Arrival Information */}
              <div className="flex flex-col lg:flex-row gap-4 text-sm text-muted-foreground">
                {journey.departure_time && (
                  <div>
                    <span>Departs: </span>
                    <span className="font-semibold">{formatDateTime(journey.departure_time)}</span>
                    {departureLocationName && (
                      <div className="text-xs">from {departureLocationName}</div>
                    )}
                  </div>
                )}

                {journey.arrival_time && (
                  <div className="border-t-1 border-muted-foreground pt-2 lg:border-t-0 lg:pt-0 lg:border-l-1 lg:pl-4">
                    <span className="">Arrives: </span>
                    <span className="font-semibold">{formatDateTime(journey.arrival_time)}</span>
                    {arrivalLocationName && <div className="text-xs">at {arrivalLocationName}</div>}
                  </div>
                )}
              </div>

              {/* Provider and Notes */}
              {(journey.provider || journey.notes) && (
                <div className="space-y-1 text-sm text-muted-foreground">
                  {journey.provider && <div className="font-medium">{journey.provider}</div>}

                  {journey.notes && <div>{journey.notes}</div>}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
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
