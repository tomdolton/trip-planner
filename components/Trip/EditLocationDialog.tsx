"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { locationFormSchema, LocationFormValues } from "@/types/forms";
import { Location } from "@/types/trip";

import { Button } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "@/components/ui/ConfirmDeleteDialog";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useDeleteLocation } from "@/lib/mutations/useDeleteLocation";
import { useUpdateLocation } from "@/lib/mutations/useUpdateLocation";

import { LocationFormFields } from "./LocationFormFields";

export function EditLocationDialog({
  location,
  open,
  onOpenChange,
  tripId,
}: {
  location: Location;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripId: string;
}) {
  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: {
      name: location.name,
      region: location.region || "",
      notes: location.notes || "",
    },
  });

  const updateMutation = useUpdateLocation(tripId);
  const deleteMutation = useDeleteLocation(tripId);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  function onSubmit(values: LocationFormValues) {
    updateMutation.mutate(
      {
        id: location.id,
        name: values.name,
        region: values.region,
        notes: values.notes,
      },
      { onSuccess: () => onOpenChange(false) }
    );
  }

  function handleDelete() {
    setShowDeleteDialog(true);
  }

  function confirmDelete() {
    deleteMutation.mutate({ id: location.id }, { onSuccess: () => onOpenChange(false) });
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
            <DialogTitle>Edit Location</DialogTitle>
          </DialogHeader>
          <LocationFormFields form={form} onSubmit={onSubmit}>
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
          </LocationFormFields>
        </DialogContent>
      </Dialog>
      <ConfirmDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title={`Delete "${location.name}"?`}
        description="This action cannot be undone. All data associated with this location will be permanently deleted."
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
      />
    </>
  );
}
