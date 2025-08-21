import { MoveRight } from "lucide-react";

import type { MapMarker } from "@/types/map-marker";
import { Trip } from "@/types/trip";

import { getMarkerTypeLabel, getMarkerDateInfo } from "../../lib/utils/mapMarkerUtils";
import { Button } from "../ui/button";

interface TripMapInfoWindowProps {
  marker: MapMarker;
  trip: Trip;
  onView: (marker: MapMarker) => void;
}

export function TripMapInfoWindow({ marker, trip, onView }: TripMapInfoWindowProps) {
  const typeLabel = getMarkerTypeLabel(marker.type);
  const dateInfo = getMarkerDateInfo(marker, trip);
  return (
    <div className="min-w-56 p-2">
      <h3 className="font-semibold text-xl text-foreground">{marker.name}</h3>
      {dateInfo && <div className="text-muted-foreground font-semibold mt-3">{dateInfo}</div>}
      <div className="text-muted-foreground text-xs font-medium mt-4">{typeLabel}</div>
      <Button variant="ghost" className="mt-4" onClick={() => onView(marker)}>
        View
        <MoveRight />
      </Button>
    </div>
  );
}
