"use client";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useCallback, useMemo } from "react";

import { Trip, Location, TripPhase } from "@/types/trip";

// Map styles for a clean, minimal look
const mapContainerStyle = {
  width: "100%",
  height: "650px",
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
};

// Enhanced location type for map display
interface MapLocation extends Location {
  phaseIndex: number;
  phaseName: string;
}

// Color coding by type - we'll determine type from the location's activities/accommodations
const getMarkerColor = (location: Location) => {
  if (location.accommodations && location.accommodations.length > 0) {
    return "#3B82F6"; // Blue for accommodation
  }
  if (location.activities && location.activities.length > 0) {
    return "#EF4444"; // Red for activity
  }
  return "#10B981"; // Green for general location
};

// Alternative: Color coding by phase
const getPhaseColor = (phaseIndex: number) => {
  const colors = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"];
  return colors[phaseIndex % colors.length];
};

interface TripMapProps {
  trip: Trip;
  colorBy?: "type" | "phase";
  onLocationClick?: (location: Location) => void;
  className?: string;
}

export function TripMap({ trip, colorBy = "type", onLocationClick, className }: TripMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  // Get all locations from all phases plus unassigned locations
  const allLocations = useMemo(() => {
    const phaseLocations: MapLocation[] =
      trip.trip_phases?.flatMap(
        (phase: TripPhase, phaseIndex: number) =>
          phase.locations?.map((location: Location) => ({
            ...location,
            phaseIndex,
            phaseName: phase.title,
          })) || []
      ) || [];

    // Add unassigned locations
    const unassignedLocations: MapLocation[] =
      trip.unassigned_locations?.map((location: Location) => ({
        ...location,
        phaseIndex: -1, // Special index for unassigned
        phaseName: "Unassigned",
      })) || [];

    const combined = [...phaseLocations, ...unassignedLocations];

    return combined;
  }, [trip.trip_phases, trip.unassigned_locations]);

  // Calculate map center and bounds
  const mapCenter = useMemo(() => {
    // Only use locations that have coordinates from their linked place
    const locationsWithCoords = allLocations.filter(
      (loc: MapLocation) => loc.place?.lat && loc.place?.lng
    );

    if (locationsWithCoords.length === 0) {
      return { lat: 51.5074, lng: -0.1278 }; // Default to London
    }

    const avgLat =
      locationsWithCoords.reduce(
        (sum: number, loc: MapLocation) => sum + (loc.place?.lat || 0),
        0
      ) / locationsWithCoords.length;

    const avgLng =
      locationsWithCoords.reduce(
        (sum: number, loc: MapLocation) => sum + (loc.place?.lng || 0),
        0
      ) / locationsWithCoords.length;

    const center = { lat: avgLat, lng: avgLng };

    return center;
  }, [allLocations]);

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      const locationsWithCoords = allLocations.filter(
        (loc: MapLocation) => loc.place?.lat && loc.place?.lng
      );

      if (locationsWithCoords.length > 1) {
        // Auto-fit bounds to show all locations
        const bounds = new window.google.maps.LatLngBounds();
        locationsWithCoords.forEach((location: MapLocation) => {
          if (location.place?.lat && location.place?.lng) {
            bounds.extend({ lat: location.place.lat, lng: location.place.lng });
          }
        });
        map.fitBounds(bounds);
      } else if (locationsWithCoords.length === 1) {
        // Center on single location
        const location = locationsWithCoords[0];
        map.setCenter({ lat: location.place!.lat, lng: location.place!.lng });
        map.setZoom(12);
      }
    },
    [allLocations]
  );

  if (!isLoaded) {
    return (
      <div
        className={`bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center ${className}`}
        style={mapContainerStyle}
      >
        <p className="text-muted-foreground">Loading map...</p>
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
        {allLocations.map((location: MapLocation) => {
          // Only show locations that have coordinates from their linked place
          if (!location.place?.lat || !location.place?.lng) {
            return null;
          }

          const markerColor =
            colorBy === "phase" ? getPhaseColor(location.phaseIndex) : getMarkerColor(location);

          return (
            <Marker
              key={location.id}
              position={{ lat: location.place.lat, lng: location.place.lng }}
              title={`${location.name} (${location.phaseName})`}
              onClick={() => onLocationClick?.(location)}
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
