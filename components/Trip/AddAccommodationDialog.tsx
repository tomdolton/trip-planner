"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { accommodationFormSchema, AccommodationFormValues } from "@/types/forms";
import { Place } from "@/types/trip";

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

  function onSubmit(values: AccommodationFormValues & { place?: Place }) {
    mutation.mutate(
      {
        locationId,
        name: values.name,
        check_in: values.check_in || undefined,
        check_out: values.check_out || undefined,
        notes: values.notes,
        url: values.url || undefined,
        place_id: values.place?.id,
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
        <Button variant="default">
          <Plus className="size-4" />
          <span className="sr-only">Add</span> Accommodation
        </Button>
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
