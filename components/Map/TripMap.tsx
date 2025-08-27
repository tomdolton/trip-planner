"use client";

import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { useCallback, useMemo, useState } from "react";

import { MapMarker } from "@/types/map-marker";
import { Trip } from "@/types/trip";

import { TripMapMarker } from "@/components/Map/TripMapMarker";

import { generateMapMarkers, getTargetIdForMarker } from "@/lib/utils/mapMarkerUtils";

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
};

interface TripMapProps {
  trip: Trip;
  className?: string;
  height?: string; // Add height prop
}

export function TripMap({ trip, className, height = "400px" }: TripMapProps) {
  const scrollToRelatedCard = useCallback((marker: MapMarker) => {
    const targetId = getTargetIdForMarker(marker);
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-2", "ring-ring/50");
      setTimeout(() => el.classList.remove("ring-2", "ring-ring/50"), 1200);
    }
  }, []);

  // State to track which marker's InfoWindow is open
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  // Dynamic map container style
  const mapContainerStyle = useMemo(
    () => ({
      width: "100%",
      height,
      minHeight: "300px",
    }),
    [height]
  );

  const allMarkers = useMemo(() => generateMapMarkers(trip), [trip]);

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
        className={`bg-card flex items-center justify-center rounded-lg ${className}`}
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
        {allMarkers.map((marker) => (
          <TripMapMarker
            key={marker.id}
            marker={marker}
            selected={selectedMarkerId === marker.id}
            onSelect={setSelectedMarkerId}
            trip={trip}
            onView={scrollToRelatedCard}
            onClose={() => setSelectedMarkerId(null)}
          />
        ))}
      </GoogleMap>
    </div>
  );
}
