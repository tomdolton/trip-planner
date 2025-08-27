import { MoveRight } from "lucide-react";

import type { MapMarker } from "@/types/map-marker";
import type { Trip } from "@/types/trip";

import { Button } from "@/components/ui/button";

import { getMarkerTypeLabel, getMarkerDateInfo } from "../../lib/utils/mapMarkerUtils";

interface TripMapInfoWindowProps {
  marker: MapMarker;
  trip: Trip;
  onView: (marker: MapMarker) => void;
}

export function TripMapInfoWindow({ marker, trip, onView }: TripMapInfoWindowProps) {
  const typeLabel = getMarkerTypeLabel(marker.type);
  const dateInfo = getMarkerDateInfo(marker, trip);
  return (
    <div className="min-w-56 space-y-3 p-2">
      <h3 className="text-foreground text-xl font-semibold">{marker.name}</h3>
      {dateInfo && <div className="text-muted-foreground font-semibold">{dateInfo}</div>}
      <div className="text-muted-foreground text-xs font-medium">{typeLabel}</div>
      <Button variant="ghost" className="mt-4" onClick={() => onView(marker)}>
        View
        <MoveRight />
      </Button>
    </div>
  );
}
