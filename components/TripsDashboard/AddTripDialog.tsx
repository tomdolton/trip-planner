"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { tripSchema, type TripFormValues } from "@/types/forms";

import { TripFormFields } from "@/components/TripsDashboard/TripFormFields";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { useAddTrip } from "@/lib/mutations/useAddTrip";

interface AddTripDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTripDialog({ open, onOpenChange }: AddTripDialogProps) {
  const form = useForm<TripFormValues>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      title: "",
      start_date: "",
      end_date: "",
      description: "",
    },
  });

  const addTrip = useAddTrip();

  function onSubmit(values: TripFormValues) {
    addTrip.mutate(values, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Trip</DialogTitle>
        </DialogHeader>
        <TripFormFields form={form}>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={addTrip.isPending}
            className="ms-auto"
            onClick={form.handleSubmit(onSubmit)}
          >
            {addTrip.isPending ? "Saving..." : "Save Trip"}
          </Button>
        </TripFormFields>
      </DialogContent>
    </Dialog>
  );
}
