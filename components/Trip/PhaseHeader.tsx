"use client";

import { Pencil, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";

import { TripPhase } from "@/types/trip";

import { ActionMenu, ActionMenuItem, ActionMenuSeparator } from "@/components/ui/ActionMenu";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "@/components/ui/ConfirmDeleteDialog";

import { useDeleteTripPhase } from "@/lib/mutations/useDeleteTripPhase";

import { openDialog } from "@/store/uiDialogSlice";

interface PhaseHeaderProps {
  phase: TripPhase;
  tripId: string;
  onAddLocation?: () => void;
}

export function PhaseHeader({ phase, tripId, onAddLocation }: PhaseHeaderProps) {
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
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 lg:gap-11">
            <h2 className="text-xl font-bold">{phase.title}</h2>

            <Button variant="outline" size="sm" onClick={onAddLocation} className="h-8 px-3">
              <Plus className="size-4 mr-1" />
              <span className="sr-only">Add</span>
              Location
            </Button>

            <ActionMenu>
              <ActionMenuItem onSelect={handleEdit}>
                <Pencil className="size-4 mr-2" />
                Edit
              </ActionMenuItem>
              <ActionMenuSeparator />
              <ActionMenuItem
                onSelect={handleDelete}
                disabled={deleteTripPhase.isPending}
                className="text-destructive"
              >
                <Trash2 className="size-4 mr-2" />
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
