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
      <Card className="border-dashed border-2 border-muted">
        <CardContent className="p-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate">{selectedPlace.name}</h4>
              <p className="text-xs text-muted-foreground truncate">
                {selectedPlace.formatted_address}
              </p>
              {selectedPlace.rating && <p className="text-xs mt-1">⭐ {selectedPlace.rating}</p>}
            </div>
            <div className="flex gap-1 ml-2">
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
                className="h-6 px-2 text-xs text-destructive hover:text-destructive"
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
      <Card className="border-dashed border-2 border-muted">
        <CardContent className="p-3">
          <p className="text-sm text-muted-foreground">Loading place...</p>
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
