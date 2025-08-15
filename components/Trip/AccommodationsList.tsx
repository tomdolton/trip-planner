import { Accommodation } from "@/types/trip";

import { AccommodationItem } from "./AccommodationItem";

interface AccommodationsListProps {
  accommodations: Accommodation[];
  tripId: string;
}

export function AccommodationsList({ accommodations, tripId }: AccommodationsListProps) {
  if (!accommodations || accommodations.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 space-y-2">
      {accommodations.map((acc) => (
        <AccommodationItem key={acc.id} accommodation={acc} tripId={tripId} />
      ))}
    </div>
  );
}
