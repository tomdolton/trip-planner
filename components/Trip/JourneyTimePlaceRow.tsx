import { format } from "date-fns";
import { MapPin } from "lucide-react";

interface JourneyTimePlaceRowProps {
  time?: string | null;
  placeName?: string;
}

export function JourneyTimePlaceRow({ time, placeName }: JourneyTimePlaceRowProps) {
  return (
    <div className="flex items-center gap-5">
      <div className="size-4.5 rounded-full bg-background border-2 border-border relative"></div>
      <span className="text-xl font-bold text-accent-foreground">
        {time ? format(new Date(time), "HH:mm") : "--"}
      </span>
      {placeName && (
        <span className="flex items-center gap-1 text-sm text-muted-foreground font-semibold">
          <MapPin className="size-4" />
          {placeName}
        </span>
      )}
    </div>
  );
}
