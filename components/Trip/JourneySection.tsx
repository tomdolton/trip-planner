"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Journey as JourneyType, Location } from "@/types/trip";

import { Button } from "@/components/ui/button";

import { getLocationDisplayName } from "@/lib/utils/journeyUtils";

import { AddJourneyDialog } from "./AddJourneyDialog";
import { AddLocationDialog } from "./AddLocationDialog";
import { JourneyDetails } from "./JourneyDetails";

export function JourneySection({
  fromLocation,
  toLocation,
  tripId,
  journey,
  onAddJourney,
  phaseId,
}: {
  fromLocation?: Location | null;
  toLocation?: Location | null;
  tripId: string;
  journey?: JourneyType;
  onAddJourney: (data: Omit<JourneyType, "id">) => void;
  phaseId?: string;
}) {
  const [showAddLocationDialog, setShowAddLocationDialog] = useState(false);

  if (journey) {
    return (
      <JourneyDetails
        journey={journey}
        tripId={tripId}
        departureLocationName={getLocationDisplayName(fromLocation, fromLocation)}
        arrivalLocationName={getLocationDisplayName(toLocation, fromLocation)}
      />
    );
  }

  return (
    <>
      <div className="my-10 flex items-center justify-end gap-4">
        {/* Add Location Button - left aligned */}
        <Button
          variant="secondary"
          onClick={() => setShowAddLocationDialog(true)}
          aria-label="Add location"
        >
          <Plus className="mr-1 size-4" />
          <span className="sr-only">Add</span>
          Location
        </Button>

        {/* Add Journey Button */}
        <AddJourneyDialog
          fromLocation={fromLocation}
          toLocation={toLocation}
          tripId={tripId}
          onAddJourney={onAddJourney}
        >
          <Button variant="secondary" aria-label="Add journey">
            <Plus className="mr-1 size-4" />
            <span className="sr-only">Add</span>
            Journey
          </Button>
        </AddJourneyDialog>
      </div>

      {/* Add Location Dialog */}
      <AddLocationDialog
        tripId={tripId}
        phaseId={phaseId}
        open={showAddLocationDialog}
        onOpenChange={setShowAddLocationDialog}
      />
    </>
  );
}
