"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { accommodationFormSchema, AccommodationFormValues } from "@/types/forms";
import { Accommodation } from "@/types/trip";

import { Button } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "@/components/ui/ConfirmDeleteDialog";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useDeleteAccommodation } from "@/lib/mutations/useDeleteAccommodation";
import { useUpdateAccommodation } from "@/lib/mutations/useUpdateAccommodation";

import { AccommodationFormFields } from "./AccommodationFormFields";

export function EditAccommodationDialog({
  accommodation,
  open,
  onOpenChange,
  tripId,
}: {
  accommodation: Accommodation;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripId: string;
}) {
  const form = useForm<AccommodationFormValues>({
    resolver: zodResolver(accommodationFormSchema),
    defaultValues: {
      name: accommodation.name,
      check_in: accommodation.check_in || "",
      check_out: accommodation.check_out || "",
      url: accommodation.url || "",
      notes: accommodation.notes || "",
    },
  });

  const updateMutation = useUpdateAccommodation(tripId);
  const deleteMutation = useDeleteAccommodation(tripId);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  function onSubmit(values: AccommodationFormValues) {
    updateMutation.mutate(
      {
        ...values,
        id: accommodation.id,
        check_in: values.check_in || undefined,
        check_out: values.check_out || undefined,
        url: values.url || undefined,
      },
      { onSuccess: () => onOpenChange(false) }
    );
  }

  function handleDelete() {
    setShowDeleteDialog(true);
  }

  function handleCancel() {
    form.reset({
      name: accommodation.name,
      check_in: accommodation.check_in || "",
      check_out: accommodation.check_out || "",
      url: accommodation.url || "",
      notes: accommodation.notes || "",
    });
    onOpenChange(false);
  }

  function confirmDelete() {
    deleteMutation.mutate({ id: accommodation.id }, { onSuccess: () => onOpenChange(false) });
    setShowDeleteDialog(false);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <div className="cursor-pointer">{/* Render children in parent */}</div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Accommodation</DialogTitle>
          </DialogHeader>
          <AccommodationFormFields form={form} onSubmit={onSubmit}>
            <Button type="button" variant="outline" onClick={handleCancel}>
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
              Save Accommodation
            </Button>
          </AccommodationFormFields>
        </DialogContent>
      </Dialog>
      <ConfirmDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title={`Delete "${accommodation.name}"?`}
        description="This action cannot be undone. All data associated with this accommodation will be permanently deleted."
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
      />
    </>
  );
}
