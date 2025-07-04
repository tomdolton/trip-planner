'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useAddTrip } from '@/lib/mutations/useAddTrip';
import { TripFormValues, tripSchema } from '@/types/forms';
import { toast } from 'sonner';

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

export default function TripForm() {
  const form = useForm<TripFormValues>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      name: '',
      start_date: '',
      end_date: '',
      notes: '',
    },
  });

  const addTrip = useAddTrip();

  const onSubmit = (data: TripFormValues) => {
    addTrip.mutate(data);
  };

  // Handle toast and reset
  useEffect(() => {
    if (addTrip.isSuccess) {
      toast.success('Trip added successfully!');
      form.reset();
    }

    if (addTrip.isError) {
      if (addTrip.error instanceof Error) {
        toast.error('Error adding trip', {
          description: addTrip.error.message,
        });
      } else {
        toast.error('Error adding trip');
      }
    }
  }, [addTrip.isSuccess, addTrip.isError, addTrip.error, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md mx-auto">
        <h2 className="text-xl font-bold">Add a New Trip</h2>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trip Name</FormLabel>
              <FormControl>
                <Input placeholder="Trip to Japan" disabled={addTrip.isPending} {...field} />
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
                <Input type="date" disabled={addTrip.isPending} {...field} />
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
                <Input type="date" disabled={addTrip.isPending} {...field} />
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
                <Textarea placeholder="Anything else..." disabled={addTrip.isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={addTrip.isPending}>
          {addTrip.isPending ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
              Saving...
            </span>
          ) : (
            'Save Trip'
          )}
        </Button>
      </form>
    </Form>
  );
}
