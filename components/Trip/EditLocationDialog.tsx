"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Location } from "@/types/trip";

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

import { useDeleteLocation } from "@/lib/mutations/useDeleteLocation";
import { useUpdateLocation } from "@/lib/mutations/useUpdateLocation";

const formSchema = z.object({
  name: z.string().min(1, "Location name is required"),
  region: z.string().optional(),
  notes: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function EditLocationDialog({
  location,
  open,
  onOpenChange,
  tripId,
}: {
  location: Location;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripId: string;
}) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: location.name,
      region: location.region || "",
      notes: location.notes || "",
      lat: location.lat ?? undefined,
      lng: location.lng ?? undefined,
    },
  });

  const updateMutation = useUpdateLocation(tripId);
  const deleteMutation = useDeleteLocation(tripId);

  function onSubmit(values: FormData) {
    updateMutation.mutate({ ...values, id: location.id }, { onSuccess: () => onOpenChange(false) });
  }

  function handleDelete() {
    if (confirm("Delete this location?")) {
      deleteMutation.mutate({ id: location.id }, { onSuccess: () => onOpenChange(false) });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <div className="cursor-pointer">{/* Render children in parent */}</div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Location</DialogTitle>
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
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
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
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="lat"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lng"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
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
