import { AddAccommodationDialog } from "./AddAccommodationDialog";
import { AddActivityDialog } from "./AddActivityDialog";

interface LocationActionsProps {
  tripId: string;
  locationId: string;
}

export function LocationActions({ tripId, locationId }: LocationActionsProps) {
  return (
    <div className="flex gap-4">
      <AddAccommodationDialog tripId={tripId} locationId={locationId} />
      <AddActivityDialog tripId={tripId} locationId={locationId} />
    </div>
  );
}
