"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";

import { Journey } from "@/types/trip";

import { ActionMenu, ActionMenuItem, ActionMenuSeparator } from "@/components/ui/ActionMenu";
import { ConfirmDeleteDialog } from "@/components/ui/ConfirmDeleteDialog";

import { journeyModeIcons, journeyModeLabels } from "@/lib/constants/journeyModes";
import { useDeleteJourney } from "@/lib/mutations/useDeleteJourney";
import { formatDateTime } from "@/lib/utils/formatDateTime";

import { openDialog } from "@/store/uiDialogSlice";

interface JourneyDetailsProps {
  journey: Journey;
  tripId: string; // Add tripId prop for the delete mutation
}

export function JourneyDetails({ journey, tripId }: JourneyDetailsProps) {
  const dispatch = useDispatch();
  const deleteJourney = useDeleteJourney(tripId);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  function handleEdit(e: React.MouseEvent) {
    e.stopPropagation();
    dispatch(openDialog({ type: "journey", entity: journey }));
  }

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    setShowDeleteDialog(true);
  }

  function confirmDelete() {
    deleteJourney.mutate({ id: journey.id });
    setShowDeleteDialog(false);
  }

  return (
    <>
      <div className="flex items-center justify-center my-4">
        {/* Decorative vertical line with icon circle and arrow */}
        <div className="relative flex items-center mr-12">
          <div className="w-px h-16 bg-slate-300 dark:bg-slate-600"></div>

          {/* Center circle with icon */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-100 dark:bg-blue-900 border-2 border-slate-300 dark:border-slate-600 rounded-full flex items-center justify-center text-sm">
            {journeyModeIcons[journey.mode as keyof typeof journeyModeIcons]}
          </div>

          {/* Arrow pointing down at bottom */}
          <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2">
            <div className="w-0 h-0 border-l-2 border-r-2 border-t-2 border-l-transparent border-r-transparent border-t-slate-300 dark:border-t-slate-600"></div>
          </div>
        </div>

        <div className="relative flex items-center gap-4 px-4 py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-700 rounded transition-colors group">
          {/* Journey details */}
          <div
            onClick={() => dispatch(openDialog({ type: "journey", entity: journey }))}
            className="flex flex-col gap-1"
          >
            <span className="font-semibold">
              {journeyModeLabels[journey.mode as keyof typeof journeyModeLabels]}
              {journey.provider && <span className="font-normal"> ({journey.provider})</span>}
            </span>

            {journey.departure_time && (
              <div className="text-sm text-muted-foreground">
                Departs: {formatDateTime(journey.departure_time)}
              </div>
            )}

            {journey.arrival_time && (
              <div className="text-sm text-muted-foreground">
                Arrives: {formatDateTime(journey.arrival_time)}
              </div>
            )}

            {journey.notes && (
              <div className="text-sm text-muted-foreground italic">{journey.notes}</div>
            )}
          </div>

          {/* Action Menu - positioned at top right */}
          <div className="absolute top-2 right-2">
            <ActionMenu side="left">
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
        </div>
      </div>

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
