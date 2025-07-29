import { Journey } from "@/types/trip";

import { journeyModeIcons, journeyModeLabels } from "@/lib/constants/journeyModes";
import { formatDateTime } from "@/lib/utils/formatDateTime";

interface JourneyDetailsProps {
  journey: Journey;
}

export function JourneyDetails({ journey }: JourneyDetailsProps) {
  return (
    <div className="flex items-center justify-center my-4">
      {/* Decorative vertical line with icon circle and arrow */}
      <div className="relative flex items-center mr-12">
        <div className="w-px h-16 bg-slate-300 dark:bg-slate-600"></div>

        {/* Center circle with icon */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-100 dark:bg-blue-900 border-2 border-slate-300 dark:border-slate-600 rounded-full flex items-center justify-center text-sm">
          {journeyModeIcons[journey.mode as keyof typeof journeyModeIcons]}
        </div>

        {/* Arrow pointing down at bottom */}
        <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2">
          <div className="w-0 h-0 border-l-6 border-r-6 border-t-10 border-l-transparent border-r-transparent border-t-slate-300 dark:border-t-slate-600"></div>
        </div>
      </div>

      <div className="flex items-center gap-4 px-4 py-2">
        {/* Journey details */}
        <div className="flex flex-col gap-1">
          <span className="font-semibold">
            {journeyModeLabels[journey.mode as keyof typeof journeyModeLabels]}
            {journey.provider && <span className="font-normal"> ({journey.provider})</span>}
          </span>

          {journey.departure_time && (
            <div className="text-sm text-muted-foreground">
              Departs: {formatDateTime(journey.departure_time)}
            </div>
          )}

          {journey.arrival_time && (
            <div className="text-sm text-muted-foreground">
              Arrives: {formatDateTime(journey.arrival_time)}
            </div>
          )}

          {journey.notes && (
            <div className="text-sm text-muted-foreground italic">{journey.notes}</div>
          )}
        </div>
      </div>
    </div>
  );
}
