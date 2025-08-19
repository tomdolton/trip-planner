"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { activityFormSchema, ActivityFormValues } from "@/types/forms";
import { Place } from "@/types/trip";

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

  function onSubmit(values: ActivityFormValues & { place?: Place }) {
    mutation.mutate(
      { ...values, locationId, placeId: values.place?.id },
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
        <Button variant="secondary">
          <Plus className="size-4" /> <span className="sr-only">Add</span> Activity
        </Button>
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
