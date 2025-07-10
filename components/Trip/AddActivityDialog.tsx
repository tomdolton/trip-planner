"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { activityFormSchema, ActivityFormValues } from "@/types/forms";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useAddActivity } from "@/lib/mutations/useAddActivity";

import { ActivityFormFields } from "./ActivityFormFields";

export function AddActivityDialog({ tripId, locationId }: { tripId: string; locationId: string }) {
  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      name: "",
      date: "",
      start_time: "",
      end_time: "",
      notes: "",
      activity_type: "sightseeing",
    },
  });

  const mutation = useAddActivity(tripId);

  function onSubmit(values: ActivityFormValues) {
    mutation.mutate(
      { ...values, locationId },
      {
        onSuccess: () => form.reset(),
      }
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">+ Add Activity</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Activity</DialogTitle>
        </DialogHeader>
        <ActivityFormFields form={form} onSubmit={onSubmit}>
          <Button type="submit" disabled={mutation.isPending}>
            Save Activity
          </Button>
        </ActivityFormFields>
      </DialogContent>
    </Dialog>
  );
}
