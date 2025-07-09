"use client";

import { AddActivityForm } from "@/components/Trip/AddActivityForm";
import { AddLocationForm } from "@/components/Trip/AddLocationForm";
import { TripActivities } from "@/components/Trip/TripActivities";
import { TripPhase } from "@/types/trip";

interface TripPhaseSectionProps {
  phase: TripPhase;
  tripId: string;
}

export function TripPhaseSection({ phase, tripId }: TripPhaseSectionProps) {
  const allActivities = phase.locations?.flatMap((loc) => loc.activities || []) ?? [];

  return (
    <div
      key={phase.id}
      className="mt-6 bg-slate-200/30 dark:bg-gray-800/30 rounded-lg p-4 border border-slate-300/30 dark:border-slate-700/30"
    >
      <h2 className="text-xl font-bold">{phase.title}</h2>
      {phase.description && <p className="text-muted-foreground">{phase.description}</p>}

      {phase.locations?.map((loc) => (
        <div key={loc.id} className="mt-4 pl-4 border-l border-slate-300 dark:border-slate-700">
          <h3 className="text-lg font-semibold">{loc.name}</h3>

          {/* Add activity to this location */}
          <AddActivityForm tripId={tripId} locationId={loc.id} />

          {/* Accommodations */}
          {loc.accommodations?.map((acc) => (
            <p key={acc.id} className="text-sm text-muted-foreground">
              🏨 {acc.name}
            </p>
          ))}
        </div>
      ))}

      {/* All activities in this phase */}
      <TripActivities activities={allActivities} />

      {/* Add new location form */}
      <AddLocationForm tripId={tripId} phaseId={phase.id} />
    </div>
  );
}
