import { useMemo } from "react";

import { Journey, TripPhase, Location } from "@/types/trip";

import { getFirstLocationOfPhase, getLastLocationOfPhase } from "@/lib/utils/journeyUtils";

interface UseJourneyHelpersProps {
  journeys?: Journey[];
  allPhases?: TripPhase[];
  currentPhase: TripPhase | { locations?: Location[] };
  phaseIndex: number;
}

export function useJourneyHelpers({
  journeys,
  allPhases,
  currentPhase,
  phaseIndex,
}: UseJourneyHelpersProps) {
  const helpers = useMemo(() => {
    /**
     * Find journey between two locations
     */
    function findJourney(fromId: string, toId: string) {
      return journeys?.find(
        (j) => j.departure_location_id === fromId && j.arrival_location_id === toId
      );
    }

    /**
     * Find cross-phase journey from current phase to next phase
     */
    function findCrossPhaseJourneyToNext() {
      if (!allPhases || phaseIndex >= allPhases.length - 1) return null;

      const nextPhase = allPhases[phaseIndex + 1];
      const fromLocation = getLastLocationOfPhase(currentPhase);
      const toLocation = getFirstLocationOfPhase(nextPhase);

      if (fromLocation && toLocation) {
        return findJourney(fromLocation.id, toLocation.id);
      }
      return null;
    }

    /**
     * Get cross-phase journey locations for the next phase
     */
    function getCrossPhaseJourneyLocationsToNext() {
      if (!allPhases || phaseIndex >= allPhases.length - 1) return null;

      const nextPhase = allPhases[phaseIndex + 1];
      const fromLocation = getLastLocationOfPhase(currentPhase);
      const toLocation = getFirstLocationOfPhase(nextPhase);

      if (fromLocation && toLocation) {
        return { fromLocation, toLocation, nextPhase };
      }
      return null;
    }

    /**
     * Check if cross-phase journey should be shown
     */
    function shouldShowCrossPhaseJourney() {
      return (
        allPhases &&
        allPhases.length > 1 &&
        phaseIndex < allPhases.length - 1 &&
        getCrossPhaseJourneyLocationsToNext() !== null
      );
    }

    return {
      findJourney,
      findCrossPhaseJourneyToNext,
      getCrossPhaseJourneyLocationsToNext,
      shouldShowCrossPhaseJourney,
    };
  }, [journeys, allPhases, currentPhase, phaseIndex]);

  return helpers;
}
