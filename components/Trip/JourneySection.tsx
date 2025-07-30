"use client";

import { Plus } from "lucide-react";

import { Journey as JourneyType, Location } from "@/types/trip";

import { Button } from "@/components/ui/button";

import { AddJourneyDialog } from "./AddJourneyDialog";
import { JourneyDetails } from "./JourneyDetails";

export function JourneySection({
  fromLocation,
  toLocation,
  tripId,
  journey,
  onAddJourney,
}: {
  fromLocation: Location;
  toLocation: Location;
  tripId: string;
  journey?: JourneyType;
  onAddJourney: (data: Omit<JourneyType, "id">) => void;
}) {
  if (journey) {
    return <JourneyDetails journey={journey} tripId={tripId} />;
  }

  return (
    <div className="flex items-center justify-center my-4">
      <AddJourneyDialog
        fromLocation={fromLocation}
        toLocation={toLocation}
        tripId={tripId}
        onAddJourney={onAddJourney}
      >
        <Button variant="outline" size="icon" className="rounded-full" aria-label="Add journey">
          <Plus />
        </Button>
      </AddJourneyDialog>
    </div>
  );
}
