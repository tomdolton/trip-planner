import { cn } from "@/lib/utils";

import { AddAccommodationDialog } from "./AddAccommodationDialog";
import { AddActivityDialog } from "./AddActivityDialog";

interface LocationActionsProps {
  tripId: string;
  locationId: string;
  className?: string;
}

export function LocationActions({ tripId, locationId, className }: LocationActionsProps) {
  return (
    <div className={cn("flex gap-4", className)}>
      <AddAccommodationDialog tripId={tripId} locationId={locationId} />
      <AddActivityDialog tripId={tripId} locationId={locationId} />
    </div>
  );
}
