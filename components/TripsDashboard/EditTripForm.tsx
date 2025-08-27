"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { TripFormValues, tripSchema } from "@/types/forms";
import { Trip } from "@/types/trip";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useUpdateTrip } from "@/lib/mutations/useUpdateTrip";

type EditTripFormProps = {
  trip: Trip;
  onClose: () => void;
};

export default function EditTripForm({ trip, onClose }: EditTripFormProps) {
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

  const onSubmit = (data: TripFormValues) => {
    updateTrip.mutate(
      { ...data, id: trip.id },
      {
        onSuccess: () => {
          toast.success("Trip updated");
          onClose();
        },
        onError: (err) => {
          toast.error("Failed to update trip", {
            description: err.message,
          });
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-lg font-semibold">Edit Trip</h2>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Trip Title</FormLabel>
              <FormControl>
                <Input disabled={updateTrip.isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Start Date</FormLabel>
              <FormControl>
                <Input type="date" disabled={updateTrip.isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="end_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>End Date</FormLabel>
              <FormControl>
                <Input type="date" disabled={updateTrip.isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea disabled={updateTrip.isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={updateTrip.isPending}>
            {updateTrip.isPending ? (
              <span className="flex items-center gap-2">
                <span className="border-border h-4 w-4 animate-spin rounded-full border border-t-transparent" />
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
