import { Button } from "./button";
import { Card, CardContent } from "./card";
import { MapPin, X } from "lucide-react";
import type { Place } from "@/types/trip";

interface SelectedPlaceCardProps {
  place: Place;
  onRemove: () => void;
}

export function SelectedPlaceCard({ place, onRemove }: SelectedPlaceCardProps) {
  return (
    <Card className="w-full">
      <CardContent className="p-3 md:p-4">
        <div className="flex items-start justify-between gap-2 md:gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-2">
              <MapPin className="text-muted-foreground h-4 w-4 flex-shrink-0" />
              <h3 className="text-sm font-medium">{place.name}</h3>
            </div>
            {place.formatted_address && (
              <p className="text-muted-foreground mb-2 text-xs">{place.formatted_address}</p>
            )}
            {/* {place.place_types && place.place_types.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {place.place_types.slice(0, 3).map((type: string) => (
                  <Badge key={type} variant="secondary" className="px-2 py-0.5 text-xs">
                    {type.replace(/_/g, " ")}
                  </Badge>
                ))}
                {place.place_types.length > 3 && (
                  <Badge variant="outline" className="px-2 py-0.5 text-xs">
                    +{place.place_types.length - 3} more
                  </Badge>
                )}
              </div>
            )} */}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-8 w-8 flex-shrink-0 p-0"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remove place</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
