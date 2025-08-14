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
    function findJourney(fromId: string | null, toId: string | null) {
      return journeys?.find(
        (j) => j.departure_location_id === fromId && j.arrival_location_id === toId
      );
    }

    /**
     * Find start journey for a phase (journey with null departure_location_id)
     */
    function findStartJourney() {
      const firstLocation = getFirstLocationOfPhase(currentPhase);
      if (!firstLocation) return null;

      return journeys?.find(
        (j) => j.departure_location_id === null && j.arrival_location_id === firstLocation.id
      );
    }

    /**
     * Find end journey for a phase (journey with null arrival_location_id)
     */
    function findEndJourney() {
      const lastLocation = getLastLocationOfPhase(currentPhase);
      if (!lastLocation) return null;

      return journeys?.find(
        (j) => j.departure_location_id === lastLocation.id && j.arrival_location_id === null
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

    /**
     * Check if start journey should be shown
     */
    function shouldShowStartJourney() {
      // Only show start journey for the first phase (index 0) or no-phase section (index -1)
      return (
        getFirstLocationOfPhase(currentPhase) !== null && (phaseIndex === 0 || phaseIndex === -1)
      );
    }

    /**
     * Check if end journey should be shown
     */
    function shouldShowEndJourney() {
      // Only show end journey for the last phase or no-phase section (index -1)
      const isLastPhase = allPhases && phaseIndex === allPhases.length - 1;
      const isNoPhaseSection = phaseIndex === -1;
      return getLastLocationOfPhase(currentPhase) !== null && (isLastPhase || isNoPhaseSection);
    }

    return {
      findJourney,
      findStartJourney,
      findEndJourney,
      findCrossPhaseJourneyToNext,
      getCrossPhaseJourneyLocationsToNext,
      shouldShowCrossPhaseJourney,
      shouldShowStartJourney,
      shouldShowEndJourney,
    };
  }, [journeys, allPhases, currentPhase, phaseIndex]);

  return helpers;
}
