"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { locationFormSchema, LocationFormValues } from "@/types/forms";
import { TripPhase, Place } from "@/types/trip";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { useAddLocation } from "@/lib/mutations/useAddLocation";

import { LocationFormFields } from "./LocationFormFields";

interface AddLocationDialogProps {
  tripId: string;
  phaseId?: string;
  phases?: TripPhase[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddLocationDialog({
  tripId,
  phaseId,
  phases = [],
  open,
  onOpenChange,
}: AddLocationDialogProps) {
  const mutation = useAddLocation(tripId);

  const showPhaseSelector = !phaseId && phases.length > 0;

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: {
      name: "",
      region: "",
      notes: "",
      phaseId: phaseId || "no-phase",
    },
  });

  function onSubmit(values: LocationFormValues & { place?: Place }) {
    const selectedPhaseId = values.phaseId || phaseId;
    const actualPhaseId = selectedPhaseId === "no-phase" ? undefined : selectedPhaseId;

    mutation.mutate(
      {
        name: values.name,
        region: values.region,
        notes: values.notes,
        phaseId: actualPhaseId,
        placeId: values.place?.id, // Link to the place
      },
      {
        onSuccess: () => {
          form.reset();
          onOpenChange?.(false);
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Location</DialogTitle>
        </DialogHeader>
        <LocationFormFields
          form={form}
          onSubmit={onSubmit}
          phases={phases}
          showPhaseSelector={showPhaseSelector}
        >
          <Button type="button" variant="outline" onClick={() => onOpenChange?.(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : "Save Location"}
          </Button>
        </LocationFormFields>
      </DialogContent>
    </Dialog>
  );
}
