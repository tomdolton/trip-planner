export const journeyModes = [
  "flight",
  "train",
  "bus",
  "car",
  "boat",
  "walk",
  "bike",
  "metro",
  "ferry",
  "taxi",
  "other",
] as const;

export type JourneyMode = (typeof journeyModes)[number];

export const journeyModeLabels: Record<JourneyMode, string> = {
  flight: "Flight",
  train: "Train",
  bus: "Bus",
  car: "Car",
  boat: "Boat",
  walk: "Walk",
  bike: "Bike",
  metro: "Metro/Subway",
  ferry: "Ferry",
  taxi: "Taxi/Rideshare",
  other: "Other",
};

export function getJourneyModeLabel(mode: JourneyMode): string {
  return journeyModeLabels[mode] || "Other";
}

export const journeyModeIcons: Record<JourneyMode, string> = {
  flight: "✈️",
  train: "🚆",
  bus: "🚌",
  car: "🚗",
  boat: "🛥️",
  walk: "🚶",
  bike: "🚴",
  metro: "🚇",
  ferry: "⛴️",
  taxi: "🚕",
  other: "❓",
};

// Lucide React icon mappings
export const journeyModeLucideIcons: Record<JourneyMode, string> = {
  flight: "Plane",
  train: "TrainFront",
  bus: "Bus",
  car: "Car",
  boat: "Ship",
  walk: "Footprints",
  bike: "Bike",
  metro: "TramFront",
  ferry: "Ship",
  taxi: "CarTaxiFront",
  other: "Luggage",
};

export function getJourneyModeIcon(mode: JourneyMode): string {
  return journeyModeIcons[mode] || "❓";
}

export function getJourneyModeLucideIcon(mode: JourneyMode): string {
  return journeyModeLucideIcons[mode] || "HelpCircle";
}
