export const activityTypes = [
  "sightseeing",
  "food",
  "museum",
  "hike",
  "beach",
  "shopping",
  "travel",
  "relax",
  "event",
  "nightlife",
  "other",
] as const;

export type ActivityType = (typeof activityTypes)[number];

export const activityTypeLabels: Record<ActivityType, string> = {
  sightseeing: "Sightseeing",
  food: "Food & Drink",
  museum: "Museum",
  hike: "Hiking",
  beach: "Beach",
  shopping: "Shopping",
  travel: "Travel Day",
  relax: "Relax",
  event: "Event",
  nightlife: "Nightlife",
  other: "Other",
};

export function getActivityTypeLabel(type: ActivityType): string {
  return activityTypeLabels[type] || "Other";
}

export const activityTypeIcons: Record<ActivityType, string> = {
  sightseeing: "🗺️",
  food: "🍽️",
  museum: "🏛️",
  hike: "🥾",
  beach: "🏖️",
  shopping: "🛍️",
  travel: "✈️",
  relax: "🧘",
  event: "🎉",
  nightlife: "🌃",
  other: "❓",
};

export function getActivityTypeIcon(type: ActivityType): string {
  return activityTypeIcons[type] || "❓";
}
