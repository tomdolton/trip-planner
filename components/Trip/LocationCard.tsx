"use client";

import { useDispatch } from "react-redux";

import { Location, Journey } from "@/types/trip";

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
    <div className="mt-4 pl-4 border-l border-slate-300 dark:border-slate-700">
      <div
        onClick={() => dispatch(openDialog({ type: "location", entity: location }))}
        className="cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-700 p-2 rounded transition-colors"
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
  );
}
