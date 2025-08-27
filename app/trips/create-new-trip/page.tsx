"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { tripSchema, TripFormValues } from "@/types/forms";

import { TripFormFields } from "@/components/TripsDashboard/TripFormFields";
import { Button } from "@/components/ui/button";

import { useAddTrip } from "@/lib/mutations/useAddTrip";

export default function CreateNewTripPage() {
  const router = useRouter();
  const form = useForm<TripFormValues>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      title: "",
      start_date: undefined,
      end_date: undefined,
      description: "",
    },
  });
  const addTrip = useAddTrip();

  const onSubmit = async (values: TripFormValues) => {
    try {
      const newTrip = await addTrip.mutateAsync(values);
      if (newTrip?.id) {
        router.push(`/trips/${newTrip.id}`);
      } else {
        router.push("/trips");
      }
    } catch (error) {
      console.error("Error creating trip:", error);
    }
  };

  return (
    <div className="container py-8">
      <div className="card mx-auto max-w-3xl space-y-8 p-6">
        <div className="bg-secondary-hover flex h-40 w-full items-end justify-center overflow-hidden rounded-xl lg:h-56">
          <Image
            src="/images/new-trip-card.png"
            alt=""
            width={320}
            height={128}
            priority
            className="h-full w-auto"
          />
        </div>

        <div className="space-y-3">
          <h1 className="text-xl font-semibold md:text-2xl">Create New Trip</h1>

          <p className="text-muted-foreground text-lg font-medium">
            Start planning your next adventure
          </p>
        </div>

        <TripFormFields form={form}>
          <Button
            type="submit"
            className="ml-auto"
            disabled={addTrip.isPending}
            onClick={form.handleSubmit(onSubmit)}
          >
            {addTrip.isPending ? "Saving..." : "Save Trip"}
          </Button>
        </TripFormFields>
      </div>
    </div>
  );
}
