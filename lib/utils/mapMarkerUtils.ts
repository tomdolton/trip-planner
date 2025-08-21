import type { MarkerType, MapMarker } from "@/types/map-marker";
import type { Trip, Location as TripLocation } from "@/types/trip";

import { formatDateRange, formatDateWithDay, formatDateTime } from "@/lib/utils/dateTime";

/**
 * Generate all map markers for a trip, including locations, activities, accommodations, and journeys.
 *
 * @param {Trip} trip - The trip object containing phases, locations, and journeys.
 * @returns {MapMarker[]} Array of map marker objects for rendering on the map.
 */
export function generateMapMarkers(trip: Trip): MapMarker[] {
  // Helper to create a marker
  const createMarker = (
    id: string,
    name: string,
    lat: number,
    lng: number,
    type: MarkerType,
    phaseIndex: number,
    phaseName: string,
    parentLocation?: TripLocation
  ): MapMarker => ({ id, name, lat, lng, type, phaseIndex, phaseName, parentLocation });

  // Get all locations from all phases plus unassigned locations
  const phaseLocations =
    trip.trip_phases?.flatMap(
      (phase: { locations?: TripLocation[]; title: string }, phaseIndex: number) =>
        phase.locations?.map((location: TripLocation) => ({
          ...location,
          phaseIndex,
          phaseName: phase.title,
        })) || []
    ) || [];

  const phaseLocationIds = new Set(phaseLocations.map((loc) => loc.id));

  const unassignedLocations =
    trip.unassigned_locations
      ?.filter((location: TripLocation) => !phaseLocationIds.has(location.id))
      ?.map((location: TripLocation) => ({
        ...location,
        phaseIndex: -1,
        phaseName: "Unassigned",
      })) || [];

  const allLocations = [...phaseLocations, ...unassignedLocations];

  const markers: MapMarker[] = [];

  // Locations, activities, accommodations
  for (const location of allLocations) {
    if (location.place?.lat && location.place?.lng) {
      markers.push(
        createMarker(
          `location-${location.id}`,
          location.name,
          location.place.lat,
          location.place.lng,
          "location",
          location.phaseIndex,
          location.phaseName,
          location
        )
      );
    }
    location.activities?.forEach((activity) => {
      if (activity.place?.lat && activity.place?.lng) {
        markers.push(
          createMarker(
            `activity-${activity.id}`,
            activity.name,
            activity.place.lat,
            activity.place.lng,
            "activity",
            location.phaseIndex,
            location.phaseName,
            location
          )
        );
      }
    });
    location.accommodations?.forEach((accommodation) => {
      if (accommodation.place?.lat && accommodation.place?.lng) {
        markers.push(
          createMarker(
            `accommodation-${accommodation.id}`,
            accommodation.name,
            accommodation.place.lat,
            accommodation.place.lng,
            "accommodation",
            location.phaseIndex,
            location.phaseName,
            location
          )
        );
      }
    });
  }

  // Memoize locationIds for each phase
  const phaseLocationIdsArr: Array<Set<string>> = (trip.trip_phases || []).map(
    (phase) => new Set((phase.locations || []).map((loc) => loc.id))
  );

  // Journey departure/arrival markers by phase
  trip.trip_phases?.forEach((phase, phaseIndex) => {
    const locationIds = phaseLocationIdsArr[phaseIndex];
    (trip.journeys || []).forEach((journey) => {
      const isDepartureInPhase =
        journey.departure_location_id && locationIds.has(journey.departure_location_id);
      const isArrivalInPhase =
        journey.arrival_location_id && locationIds.has(journey.arrival_location_id);
      if (
        isDepartureInPhase &&
        journey.departure_place &&
        journey.departure_place.lat &&
        journey.departure_place.lng
      ) {
        markers.push(
          createMarker(
            `journey-departure-${journey.id}`,
            journey.departure_place.name,
            journey.departure_place.lat,
            journey.departure_place.lng,
            "journey_departure",
            phaseIndex,
            phase.title
          )
        );
      }
      if (
        isArrivalInPhase &&
        journey.arrival_place &&
        journey.arrival_place.lat &&
        journey.arrival_place.lng
      ) {
        markers.push(
          createMarker(
            `journey-arrival-${journey.id}`,
            journey.arrival_place.name,
            journey.arrival_place.lat,
            journey.arrival_place.lng,
            "journey_arrival",
            phaseIndex,
            phase.title
          )
        );
      }
    });
  });

  // Unassigned journeys
  (trip.journeys || []).forEach((journey) => {
    if (
      journey.departure_place &&
      journey.departure_place.lat &&
      journey.departure_place.lng &&
      (!journey.departure_location_id ||
        !phaseLocationIdsArr.some((ids) => ids.has(journey.departure_location_id!)))
    ) {
      markers.push(
        createMarker(
          `journey-departure-${journey.id}`,
          journey.departure_place.name,
          journey.departure_place.lat,
          journey.departure_place.lng,
          "journey_departure",
          -1,
          "Unassigned"
        )
      );
    }
    if (
      journey.arrival_place &&
      journey.arrival_place.lat &&
      journey.arrival_place.lng &&
      (!journey.arrival_location_id ||
        !phaseLocationIdsArr.some((ids) => ids.has(journey.arrival_location_id!)))
    ) {
      markers.push(
        createMarker(
          `journey-arrival-${journey.id}`,
          journey.arrival_place.name,
          journey.arrival_place.lat,
          journey.arrival_place.lng,
          "journey_arrival",
          -1,
          "Unassigned"
        )
      );
    }
  });

  return markers;
}

/**
 * Get a human-readable label for a marker type.
 *
 * @param {MarkerType} type - The marker type string.
 * @returns {string} The display label for the marker type.
 */
export function getMarkerTypeLabel(type: MarkerType): string {
  switch (type) {
    case "location":
      return "Location";
    case "activity":
      return "Activity";
    case "accommodation":
      return "Accommodation";
    case "journey_departure":
      return "Journey Departure";
    case "journey_arrival":
      return "Journey Arrival";
    default:
      return type;
  }
}

/**
 * Get a formatted date or date range string for a marker, if available.
 *
 * @param {MapMarker} marker - The marker to get date info for.
 * @param {Trip} trip - The trip object (for journey lookups).
 * @returns {string | null} The formatted date info, or null if not available.
 */
export function getMarkerDateInfo(marker: MapMarker, trip: Trip): string | null {
  switch (marker.type) {
    case "activity": {
      if (marker.parentLocation) {
        const activity = marker.parentLocation.activities?.find(
          (a: { id: string; date?: string }) => `activity-${a.id}` === marker.id
        );
        if (activity?.date) {
          return formatDateWithDay(activity.date);
        }
      }
      break;
    }
    case "accommodation": {
      if (marker.parentLocation) {
        const accommodation = marker.parentLocation.accommodations?.find(
          (a: { id: string; check_in?: string; check_out?: string }) =>
            `accommodation-${a.id}` === marker.id
        );
        if (accommodation?.check_in || accommodation?.check_out) {
          return formatDateRange(accommodation.check_in, accommodation.check_out);
        }
      }
      break;
    }
    case "journey_departure": {
      if (trip.journeys) {
        const journey = trip.journeys.find(
          (j: { id: string; departure_time?: string }) => `journey-departure-${j.id}` === marker.id
        );
        if (journey?.departure_time) {
          return `Departure: ${formatDateTime(journey.departure_time)}`;
        }
      }
      break;
    }
    case "journey_arrival": {
      if (trip.journeys) {
        const journey = trip.journeys.find(
          (j: { id: string; arrival_time?: string }) => `journey-arrival-${j.id}` === marker.id
        );
        if (journey?.arrival_time) {
          return `Arrival: ${formatDateTime(journey.arrival_time)}`;
        }
      }
      break;
    }
    default:
      return null;
  }
  return null;
}

/**
 * Get the DOM element ID for a marker, used for scrolling to the related card.
 *
 * For journey markers, this returns the journey card ID; for others, the marker's own ID.
 *
 * @param {MapMarker} marker - The marker to get the target ID for.
 * @returns {string} The DOM element ID for the related card.
 */
export function getTargetIdForMarker(marker: MapMarker): string {
  if (marker.type === "journey_departure" || marker.type === "journey_arrival") {
    const journeyId = marker.id.replace(/^journey-(departure|arrival)-/, "");
    return `journey-${journeyId}`;
  }
  return marker.id;
}
