"use client";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useCallback, useMemo } from "react";

import { Trip, Location } from "@/types/trip";

interface MapLocation extends Location {
  phaseIndex: number;
  phaseName: string;
}

type MarkerType =
  | "location"
  | "activity"
  | "accommodation"
  | "journey_departure"
  | "journey_arrival";
interface MapMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: MarkerType;
  phaseIndex: number;
  phaseName: string;
  parentLocation?: Location;
}

// Color coding for specific marker types
const getMarkerColorByType = (type: MarkerType) => {
  switch (type) {
    case "accommodation":
      return "#3B82F6"; // Blue for accommodation
    case "activity":
      return "#EF4444"; // Red for activity
    case "location":
      return "#10B981"; // Green for general location
    case "journey_departure":
      return "#F59E0B"; // Amber for journey departure
    case "journey_arrival":
      return "#8B5CF6"; // Purple for journey arrival
    default:
      return "#6B7280";
  }
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
};

interface TripMapProps {
  trip: Trip;
  onLocationClick?: (location: Location) => void;
  className?: string;
  height?: string; // Add height prop
}

export function TripMap({ trip, onLocationClick, className, height = "400px" }: TripMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  // Dynamic map container style
  const mapContainerStyle = useMemo(
    () => ({
      width: "100%",
      height,
      minHeight: "300px", // Ensure minimum height
    }),
    [height]
  );

  // Get all locations from all phases plus unassigned locations
  const allLocations = useMemo(() => {
    const phaseLocations: MapLocation[] =
      trip.trip_phases?.flatMap(
        (phase: { locations?: Location[]; title: string }, phaseIndex: number) =>
          phase.locations?.map((location: Location) => ({
            ...location,
            phaseIndex,
            phaseName: phase.title,
          })) || []
      ) || [];

    // Get IDs of locations that are already in phases
    const phaseLocationIds = new Set(phaseLocations.map((loc) => loc.id));

    // Add unassigned locations, but exclude ones that are already in phases
    const unassignedLocations: MapLocation[] =
      trip.unassigned_locations
        ?.filter((location: Location) => !phaseLocationIds.has(location.id)) // Filter out duplicates
        ?.map((location: Location) => ({
          ...location,
          phaseIndex: -1, // Special index for unassigned
          phaseName: "Unassigned",
        })) || [];

    const combined = [...phaseLocations, ...unassignedLocations];

    return combined;
  }, [trip.trip_phases, trip.unassigned_locations]);

  // Helper to create a marker
  const createMarker = (
    id: string,
    name: string,
    lat: number,
    lng: number,
    type: MarkerType,
    phaseIndex: number,
    phaseName: string,
    parentLocation?: Location
  ): MapMarker => ({ id, name, lat, lng, type, phaseIndex, phaseName, parentLocation });

  const allMarkers = useMemo(() => {
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
    const phaseLocationIds: Array<Set<string>> = (trip.trip_phases || []).map(
      (phase) => new Set((phase.locations || []).map((loc) => loc.id))
    );

    // Journey departure/arrival markers by phase
    trip.trip_phases?.forEach((phase, phaseIndex) => {
      const locationIds = phaseLocationIds[phaseIndex];
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
      // Only add if not already added above
      if (
        journey.departure_place &&
        journey.departure_place.lat &&
        journey.departure_place.lng &&
        (!journey.departure_location_id ||
          !phaseLocationIds.some((ids) => ids.has(journey.departure_location_id!)))
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
          !phaseLocationIds.some((ids) => ids.has(journey.arrival_location_id!)))
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
  }, [allLocations, trip.trip_phases, trip.journeys]);

  // Calculate map center and bounds
  const mapCenter = useMemo(() => {
    if (allMarkers.length === 0) {
      return { lat: 51.5074, lng: -0.1278 }; // Default to London
    }

    const avgLat = allMarkers.reduce((sum, marker) => sum + marker.lat, 0) / allMarkers.length;
    const avgLng = allMarkers.reduce((sum, marker) => sum + marker.lng, 0) / allMarkers.length;

    return { lat: avgLat, lng: avgLng };
  }, [allMarkers]);

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      if (allMarkers.length > 1) {
        // Auto-fit bounds to show all markers
        const bounds = new window.google.maps.LatLngBounds();
        allMarkers.forEach((marker) => {
          bounds.extend({ lat: marker.lat, lng: marker.lng });
        });
        map.fitBounds(bounds);
      } else if (allMarkers.length === 1) {
        // Center on single marker
        const marker = allMarkers[0];
        map.setCenter({ lat: marker.lat, lng: marker.lng });
        map.setZoom(12);
      }
    },
    [allMarkers]
  );

  if (!isLoaded) {
    return (
      <div
        className={`bg-card rounded-lg flex items-center justify-center ${className}`}
        style={mapContainerStyle}
      >
        <p className="text-card-foreground">Loading map...</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={10}
        onLoad={onLoad}
        options={mapOptions}
      >
        {allMarkers.map((marker) => {
          const markerColor = getMarkerColorByType(marker.type);
          return (
            <Marker
              key={marker.id}
              position={{ lat: marker.lat, lng: marker.lng }}
              title={`${marker.name} (${marker.phaseName})`}
              onClick={() => onLocationClick?.(marker.parentLocation!)}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: markerColor,
                fillOpacity: 0.8,
                strokeColor: "#ffffff",
                strokeWeight: 2,
              }}
            />
          );
        })}
      </GoogleMap>
    </div>
  );
}
