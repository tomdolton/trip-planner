import { MoveRight, X } from "lucide-react";

import type { MapMarker } from "@/types/map-marker";
import { Trip } from "@/types/trip";

import { getMarkerTypeLabel, getMarkerDateInfo } from "../../lib/utils/mapMarkerUtils";
import { Button } from "../ui/button";

interface TripMapInfoWindowProps {
  marker: MapMarker;
  trip: Trip;
  onView: (marker: MapMarker) => void;
  onClose: () => void;
}

export function TripMapInfoWindow({ marker, trip, onView, onClose }: TripMapInfoWindowProps) {
  const typeLabel = getMarkerTypeLabel(marker.type);
  const dateInfo = getMarkerDateInfo(marker, trip);
  return (
    <div className="min-w-56 p-2">
      {/* Optional custom close button - uncomment if you want to disable the default close button */}
      <div className="text-end">
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto size-8 text-slate-800"
          onClick={onClose}
        >
          <X className="size-6" />
        </Button>
      </div>
      <h3 className="text-xl font-semibold text-slate-800">{marker.name}</h3>
      {dateInfo && <div className="mt-3 font-semibold text-slate-500">{dateInfo}</div>}
      <div className="mt-4 text-xs font-medium text-slate-500">{typeLabel}</div>
      <Button variant="ghost" className="mt-4 text-slate-800" onClick={() => onView(marker)}>
        View
        <MoveRight />
      </Button>
    </div>
  );
}
