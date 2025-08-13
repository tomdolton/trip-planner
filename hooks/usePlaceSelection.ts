import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

import { GooglePlaceResult } from "@/types/google-places";
import { Place } from "@/types/trip";

import { useUpsertPlace } from "@/lib/mutations/useUpsertPlace";

interface UsePlaceSelectionOptions<T extends Record<string, unknown> = Record<string, unknown>> {
  form: UseFormReturn<T & { name: string }>;
  onPlaceSelected?: (place: Place, googlePlace: GooglePlaceResult) => void;
}

export function usePlaceSelection<T extends Record<string, unknown> = Record<string, unknown>>({
  form,
  onPlaceSelected,
}: UsePlaceSelectionOptions<T>) {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isManualMode, setIsManualMode] = useState(false);
  const upsertPlace = useUpsertPlace();

  const handlePlaceSelected = async (googlePlace: GooglePlaceResult) => {
    try {
      const place = await upsertPlace.mutateAsync(googlePlace);
      setSelectedPlace(place);

      // Auto-fill the name with the place name and update form field
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (form.setValue as any)("name", googlePlace.name);

      // Exit manual mode since a place was selected
      setIsManualMode(false);

      // Clear any validation errors since we now have a valid name
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (form.clearErrors as any)("name");

      // Call custom callback if provided
      onPlaceSelected?.(place, googlePlace);
    } catch (error) {
      console.error("Error saving place:", error);
    }
  };

  const clearPlace = () => {
    setSelectedPlace(null);
    setIsManualMode(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (form.setValue as any)("name", "");
  };

  const toggleManualMode = () => {
    setIsManualMode(!isManualMode);
  };

  return {
    selectedPlace,
    isManualMode,
    setIsManualMode,
    handlePlaceSelected,
    clearPlace,
    toggleManualMode,
  };
}
