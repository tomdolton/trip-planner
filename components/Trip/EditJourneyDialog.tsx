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
  departureLocationName,
  arrivalLocationName,
}: {
  journey: Journey;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripId: string;
  departureLocationName?: string;
  arrivalLocationName?: string;
}) {
  // Helper function to split datetime string into date and time parts
  const splitDateTime = (dateTime?: string) => {
    if (!dateTime) return { date: "", time: "" };
    const [date, time] = dateTime.split("T");
    return {
      date: date || "",
      time: time ? time.substring(0, 5) : "", // Remove seconds
    };
  };

  const departureDateTime = splitDateTime(journey.departure_time);
  const arrivalDateTime = splitDateTime(journey.arrival_time);

  const form = useForm<JourneyFormValues>({
    resolver: zodResolver(journeyFormSchema),
    defaultValues: {
      provider: journey.provider || "",
      mode: journey.mode,
      departure_date: departureDateTime.date,
      departure_time: departureDateTime.time,
      arrival_date: arrivalDateTime.date,
      arrival_time: arrivalDateTime.time,
      notes: journey.notes || "",
    },
  });

  const updateMutation = useUpdateJourney(tripId);
  const deleteMutation = useDeleteJourney(tripId);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  function onSubmit(values: JourneyFormValues) {
    // Combine date and time fields into datetime strings for the database
    const departureDateTime =
      values.departure_date && values.departure_time
        ? `${values.departure_date}T${values.departure_time}`
        : undefined;

    const arrivalDateTime =
      values.arrival_date && values.arrival_time
        ? `${values.arrival_date}T${values.arrival_time}`
        : undefined;

    updateMutation.mutate(
      {
        id: journey.id,
        provider: values.provider,
        mode: values.mode,
        departure_time: departureDateTime,
        arrival_time: arrivalDateTime,
        notes: values.notes,
      },
      { onSuccess: () => onOpenChange(false) }
    );
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
            <DialogTitle>Edit a Journey</DialogTitle>
            {departureLocationName && arrivalLocationName && (
              <p className="text-sm text-muted-foreground">
                {departureLocationName} → {arrivalLocationName}
              </p>
            )}
          </DialogHeader>
          <JourneyFormFields form={form} onSubmit={onSubmit}>
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
              Save Journey
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
