"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
  children: React.ReactNode; // The trigger button
}

export function AddJourneyDialog({
  fromLocation,
  toLocation,
  tripId,
  onAddJourney,
  children,
}: AddJourneyDialogProps) {
  const form = useForm<JourneyFormValues>({
    resolver: zodResolver(journeyFormSchema),
    defaultValues: {
      provider: "",
      mode: "",
      departure_time: "",
      arrival_time: "",
      notes: "",
    },
  });

  function onSubmit(values: JourneyFormValues) {
    onAddJourney({
      trip_id: tripId,
      departure_location_id: fromLocation.id,
      arrival_location_id: toLocation.id,
      mode: values.mode,
      notes: values.notes || undefined,
      provider: values.provider || undefined,
      departure_time: values.departure_time || undefined,
      arrival_time: values.arrival_time || undefined,
    });
    form.reset();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add Journey: {fromLocation.name} → {toLocation.name}
          </DialogTitle>
        </DialogHeader>
        <JourneyFormFields form={form} onSubmit={onSubmit}>
          <Button type="submit">Save Journey</Button>
        </JourneyFormFields>
      </DialogContent>
    </Dialog>
  );
}
