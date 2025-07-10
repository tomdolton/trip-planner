"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
        onSuccess: () => form.reset(),
      }
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">+ Add Accommodation</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Accommodation</DialogTitle>
        </DialogHeader>
        <AccommodationFormFields form={form} onSubmit={onSubmit}>
          <Button type="submit" disabled={mutation.isPending}>
            Save Accommodation
          </Button>
        </AccommodationFormFields>
      </DialogContent>
    </Dialog>
  );
}
