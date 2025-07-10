"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

import { useAddAccommodation } from "@/lib/mutations/useAddAccommodation";

const formSchema = z.object({
  name: z.string().min(1, "Accommodation name is required"),
  check_in: z.string().optional(),
  check_out: z.string().optional(),
  url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function AddAccommodationForm({
  tripId,
  locationId,
}: {
  tripId: string;
  locationId: string;
}) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      check_in: "",
      check_out: "",
      notes: "",
      url: "",
    },
  });

  const mutation = useAddAccommodation(tripId);

  function onSubmit(values: FormData) {
    mutation.mutate(
      {
        locationId,
        name: values.name,
        check_in: values.check_in || undefined,
        check_out: values.check_out || undefined,
        notes: values.notes,
        url: values.url || undefined,
      },
      {
        onSuccess: () => form.reset(),
      }
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">+ Add Accommodation</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Accommodation</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="check_in"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Check-in</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="check_out"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Check-out</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Booking URL</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://..." {...field} />
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
                    <Textarea {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={mutation.isPending}>
              Save Accommodation
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
