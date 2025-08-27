import { useState } from "react";

import { GooglePlaceResult } from "@/types/google-places";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GooglePlacesAutocomplete } from "@/components/ui/GooglePlacesAutocomplete";

import { usePlaceDetail } from "@/lib/queries/usePlaceDetail";
import { useUpsertPlace } from "@/lib/mutations/useUpsertPlace";

interface JourneyPlaceFieldProps {
  field: {
    value: string | null | undefined;
    onChange: (value: string | null) => void;
  };
  placeholder?: string;
  className?: string;
}

export function JourneyPlaceField({
  field,
  placeholder = "Search for a place...",
  className,
}: JourneyPlaceFieldProps) {
  const [showSearch, setShowSearch] = useState(!field.value);
  const { data: selectedPlace, isLoading } = usePlaceDetail(field.value);
  const upsertPlace = useUpsertPlace();

  // If we have a value but no search is showing, we're in "display mode"
  const isDisplayMode = field.value && !showSearch;

  const handlePlaceSelected = async (googlePlace: GooglePlaceResult) => {
    try {
      const place = await upsertPlace.mutateAsync(googlePlace);
      field.onChange(place.id);
      setShowSearch(false);
    } catch (error) {
      console.error("Error saving place:", error);
    }
  };

  const handleClearPlace = () => {
    field.onChange(null);
    setShowSearch(true);
  };

  const handleChangePlace = () => {
    setShowSearch(true);
  };

  if (isDisplayMode && selectedPlace) {
    return (
      <Card className="border-muted border-2 border-dashed">
        <CardContent className="p-3">
          <div className="flex flex-col items-start justify-between gap-2 md:flex-row">
            <div className="min-w-0 flex-1">
              <h4 className="truncate text-sm font-medium">{selectedPlace.name}</h4>
              <p className="text-muted-foreground truncate text-xs">
                {selectedPlace.formatted_address}
              </p>
              {selectedPlace.rating && <p className="mt-1 text-xs">⭐ {selectedPlace.rating}</p>}
            </div>
            <div className="ml-2 flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleChangePlace}
                className="h-6 px-2 text-xs"
              >
                Change
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearPlace}
                className="text-destructive hover:text-destructive h-6 px-2 text-xs"
              >
                Remove
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isDisplayMode && isLoading) {
    return (
      <Card className="border-muted border-2 border-dashed">
        <CardContent className="p-3">
          <p className="text-muted-foreground text-sm">Loading place...</p>
        </CardContent>
      </Card>
    );
  }

  // Show search mode
  return (
    <GooglePlacesAutocomplete
      value=""
      onChange={() => {}} // We don't use this in search mode
      onPlaceSelected={handlePlaceSelected}
      placeholder={placeholder}
      className={className}
    />
  );
}
