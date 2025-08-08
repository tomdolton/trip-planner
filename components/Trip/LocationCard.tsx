"use client";

import { useDispatch } from "react-redux";

import { Location, Journey } from "@/types/trip";

import { Card, CardContent } from "@/components/ui/card";

import { openDialog } from "@/store/uiDialogSlice";

import { AccommodationsList } from "./AccommodationsList";
import { JourneySection } from "./JourneySection";
import { LocationActions } from "./LocationActions";
import { TripActivities } from "./TripActivities";

interface LocationCardProps {
  location: Location;
  tripId: string;
  nextLocation?: Location;
  journey?: Journey;
  onAddJourney: (journeyData: Omit<Journey, "id">) => void;
}

export function LocationCard({
  location,
  tripId,
  nextLocation,
  journey,
  onAddJourney,
}: LocationCardProps) {
  const dispatch = useDispatch();

  return (
    <Card className="mt-4">
      <CardContent className="p-4">
        <div className="pl-4 border-l border-border">
          <div
            onClick={() => dispatch(openDialog({ type: "location", entity: location }))}
            className="cursor-pointer p-2 rounded"
          >
            <h3 className="text-lg font-semibold cursor-pointer">{location.name}</h3>
          </div>

          <LocationActions tripId={tripId} locationId={location.id} />

          <AccommodationsList accommodations={location.accommodations ?? []} />

          <TripActivities activities={location.activities ?? []} />

          {nextLocation && (
            <JourneySection
              fromLocation={location}
              toLocation={nextLocation}
              tripId={tripId}
              journey={journey}
              onAddJourney={onAddJourney}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
