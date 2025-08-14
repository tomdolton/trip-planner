import { JourneyFormValues } from "@/types/forms";
import { TripPhase, Location } from "@/types/trip";

/**
 * Combines date and time fields into datetime strings for the database
 */
export function combineDateTimeFields(values: JourneyFormValues) {
  const departureDateTime =
    values.departure_date && values.departure_time
      ? `${values.departure_date}T${values.departure_time}`
      : undefined;

  const arrivalDateTime =
    values.arrival_date && values.arrival_time
      ? `${values.arrival_date}T${values.arrival_time}`
      : undefined;

  return { departureDateTime, arrivalDateTime };
}

/**
 * Gets the last location of a phase
 */
export function getLastLocationOfPhase(
  phase: TripPhase | { locations?: Location[] }
): Location | null {
  const locations = phase.locations;
  if (!locations || locations.length === 0) return null;
  return locations[locations.length - 1];
}

/**
 * Gets the first location of a phase
 */
export function getFirstLocationOfPhase(
  phase: TripPhase | { locations?: Location[] }
): Location | null {
  const locations = phase.locations;
  if (!locations || locations.length === 0) return null;
  return locations[0];
}
