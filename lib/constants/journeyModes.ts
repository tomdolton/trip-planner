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

export function getJourneyModeIcon(mode: JourneyMode): string {