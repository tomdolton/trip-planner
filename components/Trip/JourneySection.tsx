"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Journey as JourneyType, Location } from "@/types/trip";

import { Button } from "@/components/ui/button";

import { JourneyDetails } from "./JourneyDetails";
import { JourneyForm } from "./JourneyForm";

export function JourneySection({
  fromLocation,
  toLocation,
  tripId,
  journey,
  onAddJourney,
}: {
  fromLocation: Location;
  toLocation: Location;
  tripId: string;
  journey?: JourneyType;
  onAddJourney: (data: Omit<JourneyType, "id">) => void;
}) {
  const [showForm, setShowForm] = useState(false);

  function handleAddJourney(data: Omit<JourneyType, "id">) {
    onAddJourney(data);
    setShowForm(false);
  }

  if (journey) {
    return <JourneyDetails journey={journey} />;
  }

  return (
    <div className="flex items-center justify-center my-4">
      {showForm ? (
        <JourneyForm
          fromLocation={fromLocation}
          toLocation={toLocation}
          tripId={tripId}
          onAddJourney={handleAddJourney}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => setShowForm(true)}
          aria-label="Add journey"
        >
          <Plus />
        </Button>
      )}
    </div>
  );
}
