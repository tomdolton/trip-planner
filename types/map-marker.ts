import type { Location as TripLocation } from "./trip";

/**
 * MarkerType represents the type of marker shown on the map.
 */
export type MarkerType =
  | "location"
  | "activity"
  | "accommodation"
  | "journey_departure"
  | "journey_arrival";

/**
 * MapMarker represents a marker to be rendered on the map.
 */
export interface MapMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: MarkerType;
  phaseIndex: number;
  phaseName: string;
  parentLocation?: TripLocation;
}
