"use client";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useCallback, useMemo } from "react";

import { Trip, Location, TripPhase } from "@/types/trip";

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
  // Handle unassigned locations (phaseIndex = -1)
  if (phaseIndex === -1) {
    return "#6B7280"; // Gray for unassigned
  }

  const colors = [
    "#3B82F6", // Blue - Phase 0
    "#EF4444", // Red - Phase 1
    "#10B981", // Green - Phase 2
    "#F59E0B", // Amber - Phase 3
    "#8B5CF6", // Purple - Phase 4
    "#EC4899", // Pink - Phase 5
  ];
  return colors[phaseIndex % colors.length];
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
  colorBy?: "type" | "phase";
  onLocationClick?: (location: Location) => void;
  className?: string;
  height?: string; // Add height prop
}

export function TripMap({
  trip,
  colorBy = "type",
  onLocationClick,
  className,
  height = "400px",
}: TripMapProps) {
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
        (phase: TripPhase, phaseIndex: number) =>
          phase.locations?.map((location: Location) => ({
            ...location,
            phaseIndex, // This will be 0, 1, 2, etc.
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
