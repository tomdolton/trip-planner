"use client";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useCallback, useMemo } from "react";

import { Trip, Location, TripPhase } from "@/types/trip";

// Enhanced location type for map display
interface MapLocation extends Location {
  phaseIndex: number;
  phaseName: string;
}

// Enhanced marker type that can represent any map item
interface MapMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: "location" | "activity" | "accommodation";
  phaseIndex: number;
  phaseName: string;
  parentLocation?: Location;
}

// Color coding for specific marker types
const getMarkerColorByType = (type: "location" | "activity" | "accommodation") => {
  switch (type) {
    case "accommodation":
      return "#3B82F6"; // Blue for accommodation
    case "activity":
      return "#EF4444"; // Red for activity
    case "location":
    default:
      return "#10B981"; // Green for general location
  }
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

  // Get all markers (locations, activities, accommodations) with coordinates
  const allMarkers = useMemo(() => {
    const markers: MapMarker[] = [];

    allLocations.forEach((location) => {
      // Add location marker if it has coordinates
      if (location.place?.lat && location.place?.lng) {
        markers.push({
          id: `location-${location.id}`,
          name: location.name,
          lat: location.place.lat,
          lng: location.place.lng,
          type: "location",
          phaseIndex: location.phaseIndex,
          phaseName: location.phaseName,
          parentLocation: location,
        });
      }

      // Add activity markers
      location.activities?.forEach((activity) => {
        if (activity.place?.lat && activity.place?.lng) {
          markers.push({
            id: `activity-${activity.id}`,
            name: activity.name,
            lat: activity.place.lat,
            lng: activity.place.lng,
            type: "activity",
            phaseIndex: location.phaseIndex,
            phaseName: location.phaseName,
            parentLocation: location,
          });
        }
      });

      // Add accommodation markers
      location.accommodations?.forEach((accommodation) => {
        if (accommodation.place?.lat && accommodation.place?.lng) {
          markers.push({
            id: `accommodation-${accommodation.id}`,
            name: accommodation.name,
            lat: accommodation.place.lat,
            lng: accommodation.place.lng,
            type: "accommodation",
            phaseIndex: location.phaseIndex,
            phaseName: location.phaseName,
            parentLocation: location,
          });
        }
      });
    });

    return markers;
  }, [allLocations]);

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
          const markerColor =
            colorBy === "phase"
              ? getPhaseColor(marker.phaseIndex)
              : getMarkerColorByType(marker.type);

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
