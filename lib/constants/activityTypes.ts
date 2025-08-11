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
  sightseeing: "#FCCEE8",
  food: "#FFD6A8",
  museum: "#FEE685",
  hike: "#B9F8CF",
  nature_gardens: "#D8F999",
  beach: "#96F7E4",
  water_activities: "#B8E6FE",
  adventure_sports: "oklch(92.4% 0.12 95.746)",
  shopping: "#F6CFFF",
  travel: "#ffd6cc",
  relax: "#DDD6FF",
  event: "#FFC9C9",
  nightlife: "#F3E8FF",
  family_kids: "#FFFBEB",
  other: "#E2E8F0",
};

export function getActivityTypeIcon(type: ActivityType): string {
  return activityTypeIcons[type] || "❓";
}

export function getActivityTypeLucideIcon(type: ActivityType): string {
  return activityTypeLucideIcons[type] || "HelpCircle";
}

export function getActivityTypeColor(type: ActivityType): string {
  return activityTypeColors[type] || "#f0f0f0";
}

export function isCustomSvgActivityType(type: ActivityType): boolean {
  return customSvgActivityTypes.includes(type);
}
