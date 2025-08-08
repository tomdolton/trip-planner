"use client";

import { useState } from "react";

import { TripPhase, Journey, Location } from "@/types/trip";

import { Button } from "@/components/ui/button";

import { useAddJourney } from "@/lib/mutations/useAddJourney";

import { AddLocationDialog } from "./AddLocationDialog";
import { LocationCard } from "./LocationCard";
import { PhaseHeader } from "./PhaseHeader";

interface TripPhaseSectionProps {
  phase:
    | TripPhase
    | { id: string; trip_id: string; title: string; description?: string; locations?: Location[] };
  tripId: string;
  journeys?: Journey[];
  isNoPhaseSection?: boolean;
}

export function TripPhaseSection({
  phase,
  tripId,
  journeys,
  isNoPhaseSection,
}: TripPhaseSectionProps) {
  const [showAddLocationDialog, setShowAddLocationDialog] = useState(false);
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

  const hasLocations = phase.locations && phase.locations.length > 0;

  return (
    <div key={phase.id} className="bg-background rounded-lg p-4 border border-border">
      {/* Only show PhaseHeader for actual phases, not the no-phase section */}
      {!isNoPhaseSection && "order" in phase && (
        <PhaseHeader phase={phase as TripPhase} tripId={tripId} />
      )}

      {/* Show custom header for no-phase section */}
      {isNoPhaseSection && (
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">{phase.title}</h2>
            {phase.description && <p className="text-muted-foreground">{phase.description}</p>}
          </div>
        </div>
      )}

      {/* Show locations if they exist */}
      {hasLocations &&
        phase.locations?.map((loc, idx) => {
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

      {/* Show empty state for phases without locations */}
      {!hasLocations && !isNoPhaseSection && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="mb-4">No locations added to this phase yet.</p>
          <Button onClick={() => setShowAddLocationDialog(true)}>Add First Location</Button>
        </div>
      )}

      {/* Show Add Location button at bottom for phases with locations */}
      {hasLocations && !isNoPhaseSection && (
        <div className="mt-4">
          <Button variant="outline" onClick={() => setShowAddLocationDialog(true)}>
            + Add Location
          </Button>
        </div>
      )}

      {/* Show Add Location button for no-phase section when it has locations */}
      {hasLocations && isNoPhaseSection && (
        <div className="mt-4">
          <Button variant="outline" onClick={() => setShowAddLocationDialog(true)}>
            + Add Location
          </Button>
        </div>
      )}

      {/* Add Location Dialog */}
      <AddLocationDialog
        tripId={tripId}
        phaseId={isNoPhaseSection ? undefined : phase.id} // Don't pass phaseId for no-phase section
        open={showAddLocationDialog}
        onOpenChange={setShowAddLocationDialog}
      />
    </div>
  );
}
