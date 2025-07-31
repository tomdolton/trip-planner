"use client";

import { TripPhase, Journey } from "@/types/trip";

import { useAddJourney } from "@/lib/mutations/useAddJourney";

import { AddLocationForm } from "./AddLocationForm";
import { LocationCard } from "./LocationCard";
import { PhaseHeader } from "./PhaseHeader";

interface TripPhaseSectionProps {
  phase: TripPhase;
  tripId: string;
  journeys?: Journey[];
}

export function TripPhaseSection({ phase, tripId, journeys }: TripPhaseSectionProps) {
  const addJourney = useAddJourney(tripId);

  // Helper to find journey between two locations
  function findJourney(fromId: string, toId: string) {
    return journeys?.find(
      (j) => j.departure_location_id === fromId && j.arrival_location_id === toId
    );
  }

  // Handler to add journey
  function handleAddJourney(journeyData: Omit<Journey, "id">) {
    addJourney.mutate(journeyData);
  }

  return (
    <div
      key={phase.id}
      className="mt-6 bg-slate-200/30 dark:bg-gray-800/30 rounded-lg p-4 border border-slate-300/30 dark:border-slate-700/30"
    >
      <PhaseHeader phase={phase} tripId={tripId} />

      {phase.locations?.map((loc, idx) => {
        const nextLocation = phase.locations?.[idx + 1];
        const journey = nextLocation ? findJourney(loc.id, nextLocation.id) : undefined;

        return (
          <LocationCard
            key={loc.id}
            location={loc}
            tripId={tripId}
            nextLocation={nextLocation}
            journey={journey}
            onAddJourney={handleAddJourney}
          />
        );
      })}

      <AddLocationForm tripId={tripId} phaseId={phase.id} />
    </div>
  );
}
