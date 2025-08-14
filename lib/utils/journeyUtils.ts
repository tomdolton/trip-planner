import { JourneyFormValues } from "@/types/forms";
import { TripPhase, Location, Journey } from "@/types/trip";

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
 * Splits a datetime string into separate date and time parts for form editing
 */
export function splitDateTime(dateTime?: string) {
  if (!dateTime) return { date: "", time: "" };
  const [date, time] = dateTime.split("T");
  return {
    date: date || "",
    time: time ? time.substring(0, 5) : "", // Remove seconds
  };
}

/**
 * Gets display name for a location, handling null values for start/end journeys
 */
export function getLocationDisplayName(
  location: Location | null | undefined,
  fromLocation?: Location | null
) {
  if (!location) return fromLocation === null ? "Start" : "End";
  return location.name;
}

/**
 * Determines if a journey is a start journey (no departure location)
 */
export function isStartJourney(journey: Journey): boolean {
  return journey.departure_location_id === null;
}

/**
 * Determines if a journey is an end journey (no arrival location)
 */
export function isEndJourney(journey: Journey): boolean {
  return journey.arrival_location_id === null;
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
