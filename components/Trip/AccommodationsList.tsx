import { Accommodation } from "@/types/trip";

import { cn } from "@/lib/utils";

import { AccommodationItem } from "./AccommodationItem";

interface AccommodationsListProps {
  accommodations: Accommodation[];
  tripId: string;
  className?: string;
}

export function AccommodationsList({ accommodations, tripId, className }: AccommodationsListProps) {
  if (!accommodations || accommodations.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-2", className)}>
      {accommodations.map((acc) => (
        <AccommodationItem key={acc.id} accommodation={acc} tripId={tripId} />
      ))}
    </div>
  );
}
