"use client";

import { MapPin } from "lucide-react";
import { useDispatch } from "react-redux";

import { Location } from "@/types/trip";

import { Card, CardContent } from "@/components/ui/card";

import { getLocationDateRange } from "@/lib/utils";

import { openDialog } from "@/store/uiDialogSlice";

import { AccommodationsList } from "./AccommodationsList";
import { LocationActions } from "./LocationActions";
import { TripActivities } from "./TripActivities";

interface LocationCardProps {
  location: Location;
  tripId: string;
}

export function LocationCard({ location, tripId }: LocationCardProps) {
  const dispatch = useDispatch();
  const dateRange = getLocationDateRange(location);

  return (
    <Card className="mt-4">
      <CardContent className="p-4">
        <div
          onClick={() => dispatch(openDialog({ type: "location", entity: location }))}
          className="cursor-pointer p-2 rounded mb-8"
        >
          <span className="inline-flex p-2 bg-secondary rounded-xl mb-6">
            <MapPin className="size-8" />
          </span>

          <h3 className="text-lg font-semibold cursor-pointer mb-3">{location.name}</h3>

          <div className="font-semibold text-muted-foreground">
            {dateRange || "No dates scheduled"}
          </div>

          <p className="text-muted-foreground mt-3">{location.notes}</p>

          <LocationActions tripId={tripId} locationId={location.id} />
        </div>

        <AccommodationsList accommodations={location.accommodations ?? []} />

        <TripActivities activities={location.activities ?? []} tripId={tripId} />
      </CardContent>
    </Card>
  );
}
