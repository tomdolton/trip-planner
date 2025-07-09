"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import { Trip } from "@/types/trip";

import { Button } from "@/components/ui/button";

import { formatDateRange } from "@/lib/utils/formatDateRange";

interface TripHeaderProps {
  trip: Trip;
  onEditClick: () => void;
}

export function TripHeader({ trip, onEditClick }: TripHeaderProps) {
  return (
    <div className="space-y-4">
      <Link
        href="/trips"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:underline"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to trips
      </Link>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{trip.title}</h1>
        <Button variant="outline" onClick={onEditClick}>
          Edit
        </Button>
      </div>

      <p className="text-muted-foreground">{formatDateRange(trip.start_date, trip.end_date)}</p>

      {trip.description && (
        <div>
          <h2 className="text-lg font-semibold mb-1">Description</h2>
          <p className="whitespace-pre-line">{trip.description}</p>
        </div>
      )}
    </div>
  );
}
