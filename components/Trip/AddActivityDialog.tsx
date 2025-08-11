"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
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
  const [open, setOpen] = useState(false);
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
        onSuccess: () => {
          form.reset();
          setOpen(false);
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">+ Add Activity</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Activity</DialogTitle>
        </DialogHeader>
        <ActivityFormFields form={form} onSubmit={onSubmit}>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button type="submit" disabled={mutation.isPending} className="ms-auto">
            {mutation.isPending ? "Saving..." : "Save Activity"}
          </Button>
        </ActivityFormFields>
      </DialogContent>
    </Dialog>
  );
}
