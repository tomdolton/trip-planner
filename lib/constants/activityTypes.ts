export const activityTypes = [
  "sightseeing",
  "food",
  "museum",
  "hike",
  "beach",
  "water_activities",
  "adventure_sports",
  "shopping",
  "nature_gardens",
  "travel",
  "relax",
  "event",
  "nightlife",
  "family_kids",
  "other",
] as const;

export type ActivityType = (typeof activityTypes)[number];

export const activityTypeLabels: Record<ActivityType, string> = {
  sightseeing: "Sightseeing",
  food: "Food & Drink",
  museum: "Museum",
  hike: "Hiking",
  beach: "Beach",
  water_activities: "Water Activities",
  adventure_sports: "Adventure Sports",
  shopping: "Shopping",
  nature_gardens: "Nature & Gardens",
  travel: "Travel Day",
  relax: "Relax",
  event: "Event",
  nightlife: "Nightlife",
  family_kids: "Family & Kids",
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
  water_activities: "🚤",
  adventure_sports: "🪂",
  shopping: "🛍️",
  nature_gardens: "🌿",
  travel: "✈️",
  relax: "🧘",
  event: "🎉",
  nightlife: "🌃",
  family_kids: "👨‍👩‍👧‍👦",
  other: "❓",
};

// Lucide React icon mappings
export const activityTypeLucideIcons: Record<ActivityType, string> = {
  sightseeing: "Map",
  food: "Utensils",
  museum: "Landmark",
  hike: "Mountain",
  beach: "Waves",
  water_activities: "Kayak",
  adventure_sports: "Bike",
  shopping: "ShoppingBag",
  nature_gardens: "Trees",
  travel: "Plane",
  relax: "custom", // Custom SVG icon
  event: "PartyPopper",
  nightlife: "BottleWine",
  family_kids: "FerrisWheel",
  other: "HelpCircle",
};

// Define which activity types use custom SVG icons
export const customSvgActivityTypes: ActivityType[] = ["relax"];

// Background colors for the icon circles
export const activityTypeColors: Record<ActivityType, string> = {
  sightseeing: "var(--color-icon-pink)",
  food: "var(--color-icon-orange)",
  museum: "var(--color-icon-amber)",
  hike: "var(--color-icon-green)",
  nature_gardens: "var(--color-icon-lime)",
  beach: "var(--color-icon-teal)",
  water_activities: "var(--color-icon-sky)",
  adventure_sports: "var(--color-icon-blue)",
  shopping: "var(--color-icon-purple)",
  travel: "var(--color-icon-red)",
  relax: "var(--color-icon-violet)",
  event: "var(--color-icon-red)",
  nightlife: "var(--color-icon-indigo)",
  family_kids: "var(--color-icon-fuchsia)",
  other: "var(--color-icon-slate)",
};

export function getActivityTypeIcon(type: ActivityType): string {
  return activityTypeIcons[type] || "❓";
}

export function getActivityTypeLucideIcon(type: ActivityType): string {
  return activityTypeLucideIcons[type] || "HelpCircle";
}

export function getActivityTypeColor(type: ActivityType): string {
  return activityTypeColors[type] || "var(--color-icon-slate)";
}

export function isCustomSvgActivityType(type: ActivityType): boolean {
  return customSvgActivityTypes.includes(type);
}
