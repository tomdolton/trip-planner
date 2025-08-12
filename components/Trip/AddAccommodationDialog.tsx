"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { accommodationFormSchema, AccommodationFormValues } from "@/types/forms";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useAddAccommodation } from "@/lib/mutations/useAddAccommodation";

import { AccommodationFormFields } from "./AccommodationFormFields";

export function AddAccommodationDialog({
  tripId,
  locationId,
}: {
  tripId: string;
  locationId: string;
}) {
  const [open, setOpen] = useState(false);

  const form = useForm<AccommodationFormValues>({
    resolver: zodResolver(accommodationFormSchema),
    defaultValues: {
      name: "",
      check_in: "",
      check_out: "",
      notes: "",
      url: "",
    },
  });

  const mutation = useAddAccommodation(tripId);

  function onSubmit(values: AccommodationFormValues) {
    mutation.mutate(
      {
        locationId,
        name: values.name,
        check_in: values.check_in || undefined,
        check_out: values.check_out || undefined,
        notes: values.notes,
        url: values.url || undefined,
      },
      {
        onSuccess: () => {
          form.reset();
          setOpen(false);
        },
      }
    );
  }

  function handleCancel() {
    form.reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">+ Add Accommodation</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Accommodation</DialogTitle>
        </DialogHeader>
        <AccommodationFormFields form={form} onSubmit={onSubmit}>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>

          <Button type="submit" disabled={mutation.isPending} className="ms-auto">
            Save Accommodation
          </Button>
        </AccommodationFormFields>
      </DialogContent>
    </Dialog>
  );
}
