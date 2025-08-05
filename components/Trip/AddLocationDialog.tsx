"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { locationFormSchema, LocationFormValues } from "@/types/forms";
import { TripPhase } from "@/types/trip";

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

  // Determine if we should show the phase selector
  // Show it when:
  // 1. No specific phaseId is provided (coming from TripHeader)
  // 2. AND there are phases available to choose from
  const showPhaseSelector = !phaseId && phases.length > 0;

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: {
      name: "",
      region: "",
      notes: "",
      lat: undefined,
      lng: undefined,
      phaseId: phaseId || "no-phase", // Default to "no-phase" instead of empty string
    },
  });

  function onSubmit(values: LocationFormValues) {
    // Use the selected phaseId from the form if available, otherwise use the prop
    const selectedPhaseId = values.phaseId || phaseId;

    // Don't pass phaseId if it's the special "no-phase" id
    const actualPhaseId = selectedPhaseId === "no-phase" ? undefined : selectedPhaseId;

    mutation.mutate(
      {
        name: values.name,
        region: values.region,
        notes: values.notes,
        lat: values.lat,
        lng: values.lng,
        phaseId: actualPhaseId,
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
      <DialogContent>
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
