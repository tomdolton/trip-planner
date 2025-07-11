"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { activityFormSchema, ActivityFormValues } from "@/types/forms";
import { Activity } from "@/types/trip";

import { Button } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "@/components/ui/ConfirmDeleteDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { useDeleteActivity } from "@/lib/mutations/useDeleteActivity";
import { useUpdateActivity } from "@/lib/mutations/useUpdateActivity";

import { ActivityFormFields } from "./ActivityFormFields";

export function EditActivityDialog({
  activity,
  open,
  onOpenChange,
  tripId,
}: {
  activity: Activity;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripId: string;
}) {
  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      name: activity.name,
      date: activity.date,
      start_time: activity.start_time || "",
      end_time: activity.end_time || "",
      notes: activity.notes || "",
      activity_type: activity.activity_type,
    },
  });

  const updateMutation = useUpdateActivity(tripId);
  const deleteMutation = useDeleteActivity(tripId);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  function onSubmit(values: ActivityFormValues) {
    updateMutation.mutate({ ...values, id: activity.id }, { onSuccess: () => onOpenChange(false) });
  }

  function handleDelete() {
    setShowDeleteDialog(true);
  }

  function confirmDelete() {
    deleteMutation.mutate({ id: activity.id }, { onSuccess: () => onOpenChange(false) });
    setShowDeleteDialog(false);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Activity</DialogTitle>
          </DialogHeader>
          <ActivityFormFields form={form} onSubmit={onSubmit}>
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
          </ActivityFormFields>
        </DialogContent>
      </Dialog>
      <ConfirmDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title={`Delete "${activity.name}"?`}
        description="This action cannot be undone. All data associated with this activity will be permanently deleted."
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
      />
    </>
  );
}
