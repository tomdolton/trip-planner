"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";

import { TripPhase } from "@/types/trip";

import { ActionMenu, ActionMenuItem, ActionMenuSeparator } from "@/components/ui/ActionMenu";
import { ConfirmDeleteDialog } from "@/components/ui/ConfirmDeleteDialog";

import { useDeleteTripPhase } from "@/lib/mutations/useDeleteTripPhase";

import { openDialog } from "@/store/uiDialogSlice";

interface PhaseHeaderProps {
  phase: TripPhase;
  tripId: string;
}

export function PhaseHeader({ phase, tripId }: PhaseHeaderProps) {
  const dispatch = useDispatch();
  const deleteTripPhase = useDeleteTripPhase(tripId);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  function handleEdit() {
    dispatch(openDialog({ type: "trip_phase", entity: phase }));
  }

  function handleDelete() {
    setShowDeleteDialog(true);
  }

  function confirmDelete() {
    deleteTripPhase.mutate({ id: phase.id });
    setShowDeleteDialog(false);
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4 group">
        <div>
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold">{phase.title}</h2>

            <ActionMenu>
              <ActionMenuItem onSelect={handleEdit}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </ActionMenuItem>
              <ActionMenuSeparator />
              <ActionMenuItem
                onSelect={handleDelete}
                disabled={deleteTripPhase.isPending}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </ActionMenuItem>
            </ActionMenu>
          </div>
          {phase.description && <p className="text-muted-foreground">{phase.description}</p>}
        </div>
      </div>

      <ConfirmDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title={`Delete "${phase.title}"?`}
        description="This action cannot be undone. All locations, accommodations, activities, and journeys within this phase will be permanently deleted."
        onConfirm={confirmDelete}
        loading={deleteTripPhase.isPending}
      />
    </>
  );
}
