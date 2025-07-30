"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { journeyFormSchema, JourneyFormValues } from "@/types/forms";
import { Journey } from "@/types/trip";

import { Button } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "@/components/ui/ConfirmDeleteDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { useDeleteJourney } from "@/lib/mutations/useDeleteJourney";
import { useUpdateJourney } from "@/lib/mutations/useUpdateJourney";

import { JourneyFormFields } from "./JourneyFormFields";

export function EditJourneyDialog({
  journey,
  open,
  onOpenChange,
  tripId,
}: {
  journey: Journey;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripId: string;
}) {
  const form = useForm<JourneyFormValues>({
    resolver: zodResolver(journeyFormSchema),
    defaultValues: {
      provider: journey.provider || "",
      mode: journey.mode,
      departure_time: journey.departure_time || "",
      arrival_time: journey.arrival_time || "",
      notes: journey.notes || "",
    },
  });

  const updateMutation = useUpdateJourney(tripId);
  const deleteMutation = useDeleteJourney(tripId);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  function onSubmit(values: JourneyFormValues) {
    updateMutation.mutate({ ...values, id: journey.id }, { onSuccess: () => onOpenChange(false) });
  }

  function handleDelete() {
    setShowDeleteDialog(true);
  }

  function confirmDelete() {
    deleteMutation.mutate({ id: journey.id }, { onSuccess: () => onOpenChange(false) });
    setShowDeleteDialog(false);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Journey</DialogTitle>
          </DialogHeader>
          <JourneyFormFields form={form} onSubmit={onSubmit}>
            <Button type="submit" disabled={updateMutation.isPending}>
              Save
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              Delete
            </Button>
          </JourneyFormFields>
        </DialogContent>
      </Dialog>
      <ConfirmDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title={`Delete "${journey.provider || "this journey"}"?`}
        description="This action cannot be undone. All data associated with this journey will be permanently deleted."
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
      />
    </>
  );
}
