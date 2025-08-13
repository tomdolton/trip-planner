"use client";

import { useDispatch } from "react-redux";

import { Location } from "@/types/trip";

import { Card, CardContent } from "@/components/ui/card";

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

  return (
    <Card className="mt-4">
      <CardContent className="p-4">
        <div
          onClick={() => dispatch(openDialog({ type: "location", entity: location }))}
          className="cursor-pointer p-2 rounded"
        >
          <h3 className="text-lg font-semibold cursor-pointer">{location.name}</h3>
        </div>

        <LocationActions tripId={tripId} locationId={location.id} />

        <AccommodationsList accommodations={location.accommodations ?? []} />

        <TripActivities activities={location.activities ?? []} />
      </CardContent>
    </Card>
  );
}
