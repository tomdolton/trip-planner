import { TripPhase } from "@/types/trip";

import { Button } from "@/components/ui/button";

interface TripMapLegendProps {
  colorBy: "type" | "phase";
  onColorByChange: (colorBy: "type" | "phase") => void;
  phases?: TripPhase[];
}

export function TripMapLegend({ colorBy, onColorByChange, phases }: TripMapLegendProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border space-y-3">
      {/* Color coding toggle */}
      <div className="flex gap-2">
        <Button
          variant={colorBy === "type" ? "default" : "outline"}
          size="sm"
          onClick={() => onColorByChange("type")}
        >
          By Type
        </Button>
        <Button
          variant={colorBy === "phase" ? "default" : "outline"}
          size="sm"
          onClick={() => onColorByChange("phase")}
        >
          By Phase
        </Button>
      </div>

      {/* Legend items */}
      <div className="space-y-2">
        <h4 className="font-medium text-sm">Legend</h4>

        {colorBy === "type" ? (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm">Accommodation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm">Activity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm">Location</span>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {/* Show unassigned locations first */}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-500"></div>
              <span className="text-sm">Unassigned</span>
            </div>
            {/* Show phases with matching colors */}
            {phases?.map((phase, index) => {
              // Use the same color logic as the map
              const colors = [
                "bg-blue-500", // Blue - matches #3B82F6
                "bg-red-500", // Red - matches #EF4444
                "bg-green-500", // Green - matches #10B981
                "bg-amber-500", // Amber - matches #F59E0B
                "bg-purple-500", // Purple - matches #8B5CF6
                "bg-pink-500", // Pink - matches #EC4899
              ];
              return (
                <div key={phase.id} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}></div>
                  <span className="text-sm">{phase.title}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
