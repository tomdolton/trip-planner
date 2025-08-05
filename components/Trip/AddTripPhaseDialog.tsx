"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { tripPhaseFormSchema, TripPhaseFormValues } from "@/types/forms";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { useAddTripPhase } from "@/lib/mutations/useAddTripPhase";

import { TripPhaseFormFields } from "./TripPhaseFormFields";

interface AddTripPhaseDialogProps {
  tripId: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddTripPhaseDialog({ tripId, open, onOpenChange }: AddTripPhaseDialogProps) {
  const form = useForm<TripPhaseFormValues>({
    resolver: zodResolver(tripPhaseFormSchema),
    defaultValues: {
      title: "",
      description: "",
      start_date: "",
      end_date: "",
    },
  });

  const mutation = useAddTripPhase(tripId);

  function onSubmit(values: TripPhaseFormValues) {
    mutation.mutate(values, {
      onSuccess: () => {
        form.reset();
        onOpenChange?.(false);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Trip Phase</DialogTitle>
        </DialogHeader>
        <TripPhaseFormFields form={form} onSubmit={onSubmit}>
          <Button type="button" variant="outline" onClick={() => onOpenChange?.(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : "Save Trip Phase"}
          </Button>
        </TripPhaseFormFields>
      </DialogContent>
    </Dialog>
  );
}
