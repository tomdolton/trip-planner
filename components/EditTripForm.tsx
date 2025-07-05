'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { TripFormValues, tripSchema } from '@/types/forms';
import { Trip } from '@/types/trip';
import { useUpdateTrip } from '@/lib/mutations/useUpdateTrip';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

type EditTripFormProps = {
  trip: Trip;
  onClose: () => void;
};

export default function EditTripForm({ trip, onClose }: EditTripFormProps) {
  const form = useForm<TripFormValues>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      name: trip.name,
      start_date: trip.start_date,
      end_date: trip.end_date,
      notes: trip.notes ?? '',
    },
  });

  const updateTrip = useUpdateTrip();

  const onSubmit = (data: TripFormValues) => {
    updateTrip.mutate(
      { ...data, id: trip.id },
      {
        onSuccess: () => {
          toast.success('Trip updated');
          onClose();
        },
        onError: (err) => {
          toast.error('Failed to update trip', {
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trip Name</FormLabel>
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
              <FormLabel>Start Date</FormLabel>
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
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <Input type="date" disabled={updateTrip.isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
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
                <span className="h-4 w-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                Saving...
              </span>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
