"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { locationFormSchema, LocationFormValues } from "@/types/forms";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useAddLocation } from "@/lib/mutations/useAddLocation";

interface AddLocationFormProps {
  tripId: string;
  phaseId: string;
}

export function AddLocationForm({ tripId, phaseId }: AddLocationFormProps) {
  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: {
      name: "",
      region: "",
      notes: "",
      lat: undefined,
      lng: undefined,
    },
  });
  const { mutate: addLocation } = useAddLocation(tripId);

  function onSubmit(values: LocationFormValues) {
    addLocation({
      phaseId,
      name: values.name,
      region: values.region,
      notes: values.notes,
      lat: values.lat,
      lng: values.lng,
    });
    form.reset();
  }

  return (
    <form className="mt-4 flex gap-2 items-center" onSubmit={form.handleSubmit(onSubmit)}>
      <Input
        type="text"
        className="w-full max-w-xs"
        placeholder="New location name"
        {...form.register("name")}
      />
      <Button size="sm" variant="secondary" type="submit">
        + Add Location
      </Button>
    </form>
  );
}
