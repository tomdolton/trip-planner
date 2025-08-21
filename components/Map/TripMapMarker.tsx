import { Marker, InfoWindow } from "@react-google-maps/api";

import type { MapMarker } from "@/types/map-marker";
import { Trip } from "@/types/trip";

import { TripMapInfoWindow } from "./TripMapInfoWindow";

interface TripMapMarkerProps {
  marker: MapMarker;
  selected: boolean;
  onSelect: (id: string) => void;
  trip: Trip;
  onView: (marker: MapMarker) => void;
  onClose: () => void;
}

const markerColors = {
  accommodation: "#2b7fff", // blue.500
  activity: "#fb2c36", // red.500
  location: "#00c951", // green.500
  journey_departure: "#fd9a00", // amber.500
  journey_arrival: "#ad46ff", // purple.500
};

export function TripMapMarker({
  marker,
  selected,
  onSelect,
  trip,
  onView,
  onClose,
}: TripMapMarkerProps) {
  const markerColor = markerColors[marker.type] || "#6B7280";
  return (
    <Marker
      key={marker.id}
      position={{ lat: marker.lat, lng: marker.lng }}
      title={`${marker.name} (${marker.phaseName})`}
      onClick={() => onSelect(marker.id)}
      icon={{
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: markerColor,
        fillOpacity: 0.9,
        strokeColor: "#ffffff",
        strokeWeight: 1,
      }}
    >
      {selected && (
        <InfoWindow position={{ lat: marker.lat, lng: marker.lng }} onCloseClick={onClose}>
          <TripMapInfoWindow marker={marker} trip={trip} onView={onView} />
        </InfoWindow>
      )}
    </Marker>
  );
}
