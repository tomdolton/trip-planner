"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Journey as JourneyType, Location } from "@/types/trip";

import { Button } from "@/components/ui/button";

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
  fromLocation: Location;
  toLocation: Location;
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
        departureLocationName={fromLocation.name}
        arrivalLocationName={toLocation.name}
      />
    );
  }

  return (
    <>
      <div className="flex items-center gap-3 my-4">
        {/* Add Location Button - left aligned */}
        <Button
          variant="outline"
          onClick={() => setShowAddLocationDialog(true)}
          aria-label="Add location"
        >
          <Plus className="w-4 h-4 mr-2" />
          Location
        </Button>

        {/* Add Journey Button */}
        <AddJourneyDialog
          fromLocation={fromLocation}
          toLocation={toLocation}
          tripId={tripId}
          onAddJourney={onAddJourney}
        >
          <Button variant="outline" aria-label="Add journey">
            <Plus className="w-4 h-4 mr-2" />
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
