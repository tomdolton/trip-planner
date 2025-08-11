"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { tripPhaseFormSchema, TripPhaseFormValues } from "@/types/forms";
import { TripPhase } from "@/types/trip";

import { Button } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "@/components/ui/ConfirmDeleteDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { useDeleteTripPhase } from "@/lib/mutations/useDeleteTripPhase";
import { useUpdateTripPhase } from "@/lib/mutations/useUpdateTripPhase";

import { TripPhaseFormFields } from "./TripPhaseFormFields";

export function EditTripPhaseDialog({
  phase,
  open,
  onOpenChange,
  tripId,
}: {
  phase: TripPhase;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripId: string;
}) {
  const form = useForm<TripPhaseFormValues>({
    resolver: zodResolver(tripPhaseFormSchema),
    defaultValues: {
      title: phase.title,
      description: phase.description || "",
      start_date: phase.start_date || "",
      end_date: phase.end_date || "",
    },
  });

  const updateMutation = useUpdateTripPhase(tripId);
  const deleteMutation = useDeleteTripPhase(tripId);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  function onSubmit(values: TripPhaseFormValues) {
    updateMutation.mutate({ ...values, id: phase.id }, { onSuccess: () => onOpenChange(false) });
  }

  function handleDelete() {
    setShowDeleteDialog(true);
  }

  function confirmDelete() {
    deleteMutation.mutate({ id: phase.id }, { onSuccess: () => onOpenChange(false) });
    setShowDeleteDialog(false);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Trip Phase</DialogTitle>
          </DialogHeader>
          <TripPhaseFormFields form={form} onSubmit={onSubmit}>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="ms-auto"
            >
              Delete
            </Button>

            <Button type="submit" disabled={updateMutation.isPending}>
              Save
            </Button>
          </TripPhaseFormFields>
        </DialogContent>
      </Dialog>
      <ConfirmDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title={`Delete "${phase.title}"?`}
        description="This action cannot be undone. All locations, accommodations, activities, and journeys within this phase will be permanently deleted."
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
      />
    </>
  );
}
