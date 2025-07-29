"use client";

import { useDispatch } from "react-redux";

import { TripPhase, Journey } from "@/types/trip";

import { AddAccommodationDialog } from "@/components/Trip/AddAccommodationDialog";
import { AddActivityDialog } from "@/components/Trip/AddActivityDialog";
import { AddLocationForm } from "@/components/Trip/AddLocationForm";
import { JourneySection } from "@/components/Trip/JourneySection";
import { TripActivities } from "@/components/Trip/TripActivities";

import { useAddJourney } from "@/lib/mutations/useAddJourney";
import { formatDateRange } from "@/lib/utils/formatDateRange";

import { openDialog } from "@/store/uiDialogSlice";

interface TripPhaseSectionProps {
  phase: TripPhase;
  tripId: string;
  journeys?: Journey[];
}

export function TripPhaseSection({ phase, tripId, journeys }: TripPhaseSectionProps) {
  const dispatch = useDispatch();
  const addJourney = useAddJourney(tripId);

  // Helper to find journey between two locations
  function findJourney(fromId: string, toId: string) {
    // Use journeys prop instead of phase.journeys
    return journeys?.find(
      (j) => j.departure_location_id === fromId && j.arrival_location_id === toId
    );
  }

  // Handler to add journey (you'll need to implement mutation)
  function handleAddJourney(journeyData: Omit<Journey, "id">) {
    addJourney.mutate(journeyData);
  }

  return (
    <div
      key={phase.id}
      className="mt-6 bg-slate-200/30 dark:bg-gray-800/30 rounded-lg p-4 border border-slate-300/30 dark:border-slate-700/30"
    >
      <h2 className="text-xl font-bold">{phase.title}</h2>
      {phase.description && <p className="text-muted-foreground">{phase.description}</p>}

      {phase.locations?.map((loc, idx) => (
        <div key={loc.id} className="mt-4 pl-4 border-l border-slate-300 dark:border-slate-700">
          <div
            onClick={() => dispatch(openDialog({ type: "location", entity: loc }))}
            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-700 p-2 rounded transition-colors"
          >
            <h3 className="text-lg font-semibold cursor-pointer">{loc.name}</h3>
          </div>

          <div className="flex gap-4">
            <AddAccommodationDialog tripId={tripId} locationId={loc.id} />

            {/* Add activity to this location */}
            <AddActivityDialog tripId={tripId} locationId={loc.id} />
          </div>

          {/* Accommodations */}
          <div className="mt-2 space-y-2">
            {loc.accommodations?.map((acc) => (
              <div
                onClick={() => dispatch(openDialog({ type: "accommodation", entity: acc }))}
                key={acc.id}
                className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-700 p-2 rounded transition-colors"
              >
                <p className="text-sm text-muted-foreground ">
                  🏨 {acc.name}{" "}
                  {acc.check_in && (
                    <span className="text-xs">
                      ({formatDateRange(acc.check_in, acc.check_out)})
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>

          {/* All activities in this phase */}
          <TripActivities activities={loc.activities ?? []} />
          {idx < (phase.locations?.length ?? 0) - 1 && phase.locations?.[idx + 1] && (
            <JourneySection
              fromLocation={loc}
              toLocation={phase.locations[idx + 1]}
              tripId={tripId}
              journey={findJourney(loc.id, phase.locations[idx + 1].id)}
              onAddJourney={handleAddJourney}
            />
          )}
        </div>
      ))}
      {/* Add new location form */}
      <AddLocationForm tripId={tripId} phaseId={phase.id} />
    </div>
  );
}
