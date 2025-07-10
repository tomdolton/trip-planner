"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Accommodation } from "@/types/trip";

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

import { useDeleteAccommodation } from "@/lib/mutations/useDeleteAccommodation";
import { useUpdateAccommodation } from "@/lib/mutations/useUpdateAccommodation";

const formSchema = z.object({
  name: z.string().min(1, "Accommodation name is required"),
  check_in: z.string().optional(),
  check_out: z.string().optional(),
  url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function EditAccommodationDialog({
  accommodation,
  open,
  onOpenChange,
  tripId,
}: {
  accommodation: Accommodation;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripId: string;
}) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: accommodation.name,
      check_in: accommodation.check_in || "",
      check_out: accommodation.check_out || "",
      url: accommodation.url || "",
      notes: accommodation.notes || "",
    },
  });

  const updateMutation = useUpdateAccommodation(tripId);
  const deleteMutation = useDeleteAccommodation(tripId);

  function onSubmit(values: FormData) {
    updateMutation.mutate(
      {
        ...values,
        id: accommodation.id,
        check_in: values.check_in || undefined,
        check_out: values.check_out || undefined,
        url: values.url || undefined,
      },
      { onSuccess: () => onOpenChange(false) }
    );
  }

  function handleDelete() {
    if (confirm("Delete this accommodation?")) {
      deleteMutation.mutate({ id: accommodation.id }, { onSuccess: () => onOpenChange(false) });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <div className="cursor-pointer">{/* Render children in parent */}</div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Accommodation</DialogTitle>
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
            <div className="flex gap-2">
              <Button type="submit" disabled={updateMutation.isPending}>
                Save
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                Delete
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
