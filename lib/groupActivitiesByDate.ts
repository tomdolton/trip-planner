import { Activity } from "@/types/trip";

export function groupActivitiesByDate(activities: Activity[]) {
  const grouped: Record<string, Activity[]> = {};

  activities.forEach((activity) => {
    const date = activity.date;
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(activity);
  });

  // Optionally sort activities by time
  for (const date in grouped) {
    grouped[date].sort((a, b) => (a.start_time || "").localeCompare(b.start_time || ""));
  }

  return grouped;
}
