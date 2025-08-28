"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { tripSchema, type TripFormValues } from "@/types/forms";
import { Trip } from "@/types/trip";

import { TripFormFields } from "@/components/TripsDashboard/TripFormFields";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { useUpdateTrip } from "@/lib/mutations/useUpdateTrip";

interface EditTripDialogProps {
  trip: Trip;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTripDialog({ trip, open, onOpenChange }: EditTripDialogProps) {
  const form = useForm<TripFormValues>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      title: trip.title,
      start_date: trip.start_date,
      end_date: trip.end_date,
      description: trip.description ?? "",
    },
  });

  const updateTrip = useUpdateTrip();

  function onSubmit(data: TripFormValues) {
    updateTrip.mutate(
      { ...data, id: trip.id },
      {
        onSuccess: () => {
          toast.success("Trip updated");
          onOpenChange(false);
        },
        onError: (err) => {
          toast.error("Failed to update trip", {
            description: err.message,
          });
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Trip</DialogTitle>
        </DialogHeader>
        <TripFormFields form={form}>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={updateTrip.isPending}
            className="ms-auto min-w-[72px]"
            onClick={form.handleSubmit(onSubmit)}
          >
            Save <span className="hidden sm:inline">Changes</span>
          </Button>
        </TripFormFields>
      </DialogContent>
    </Dialog>
  );
}
