"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { journeyFormSchema, JourneyFormValues } from "@/types/forms";
import { Journey, Location } from "@/types/trip";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { JourneyFormFields } from "./JourneyFormFields";

interface AddJourneyDialogProps {
  fromLocation: Location;
  toLocation: Location;
  tripId: string;
  onAddJourney: (data: Omit<Journey, "id">) => void;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddJourneyDialog({
  fromLocation,
  toLocation,
  tripId,
  onAddJourney,
  children,
  open,
  onOpenChange,
}: AddJourneyDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  // Use internal state if external state is not provided
  const isControlled = open !== undefined && onOpenChange !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = isControlled ? onOpenChange : setInternalOpen;
  const form = useForm<JourneyFormValues>({
    resolver: zodResolver(journeyFormSchema),
    defaultValues: {
      provider: "",
      mode: "",
      departure_date: "",
      departure_time: "",
      arrival_date: "",
      arrival_time: "",
      notes: "",
    },
  });

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

    onAddJourney({
      trip_id: tripId,
      departure_location_id: fromLocation.id,
      arrival_location_id: toLocation.id,
      mode: values.mode,
      notes: values.notes || undefined,
      provider: values.provider || undefined,
      departure_time: departureDateTime,
      arrival_time: arrivalDateTime,
    });
    form.reset();
    setDialogOpen(false);
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Journey</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {fromLocation.name} → {toLocation.name}
          </p>
        </DialogHeader>
        <JourneyFormFields form={form} onSubmit={onSubmit}>
          <Button
            type="button"
            variant="outline"
            onClick={() => setDialogOpen(false)}
            className="ms-auto"
          >
            Cancel
          </Button>
          <Button type="submit">Save Journey</Button>
        </JourneyFormFields>
      </DialogContent>
    </Dialog>
  );
}
