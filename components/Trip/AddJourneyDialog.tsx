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

import { combineDateTimeFields, getLocationDisplayName } from "@/lib/utils/journeyUtils";

import { JourneyFormFields } from "./JourneyFormFields";

interface AddJourneyDialogProps {
  fromLocation?: Location | null;
  toLocation?: Location | null;
  tripId: string;
  onAddJourney: (data: Omit<Journey, "id">) => void;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Optional title override for cross-phase journeys */
  title?: string;
}

export function AddJourneyDialog({
  fromLocation,
  toLocation,
  tripId,
  onAddJourney,
  children,
  open,
  onOpenChange,
  title = "Add a Journey",
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
    // Use the utility function for date/time combination
    const { departureDateTime, arrivalDateTime } = combineDateTimeFields(values);

    onAddJourney({
      trip_id: tripId,
      departure_location_id: fromLocation?.id || null,
      arrival_location_id: toLocation?.id || null,
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
          <DialogTitle>{title}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {getLocationDisplayName(fromLocation, fromLocation)} →{" "}
            {getLocationDisplayName(toLocation, fromLocation)}
          </p>
        </DialogHeader>
        <JourneyFormFields form={form} onSubmit={onSubmit}>
          <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" className="ms-auto">
            Save Journey
          </Button>
        </JourneyFormFields>
      </DialogContent>
    </Dialog>
  );
}
