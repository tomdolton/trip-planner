import { format } from "date-fns";
import { MapPin } from "lucide-react";

interface JourneyTimePlaceRowProps {
  time?: string | null;
  placeName?: string;
}

export function JourneyTimePlaceRow({ time, placeName }: JourneyTimePlaceRowProps) {
  return (
    <div className="bg-accent relative flex w-full flex-col items-center gap-1 rounded-md border py-5 @md:w-auto @md:flex-row @md:gap-5 @md:border-0 @md:bg-transparent @md:py-0">
      <div className="bg-background border-border relative hidden size-4.5 rounded-full border-2 @md:block"></div>
      <span className="text-accent-foreground text-xl font-bold">
        {time ? format(new Date(time), "HH:mm") : "--"}
      </span>
      {placeName && (
        <span className="text-muted-foreground flex items-center gap-1 text-sm font-semibold">
          <MapPin className="size-4" />
          {placeName}
        </span>
      )}
    </div>
  );
}
