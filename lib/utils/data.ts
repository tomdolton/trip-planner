import { Activity } from "@/types/trip";

// ============================
// DATA GROUPING FUNCTIONS
// ============================

/**
 * Groups activities by their date
 * @param activities - Array of activities to group
 * @returns Object with date strings as keys and activity arrays as values
 */
export function groupActivitiesByDate(activities: Activity[]) {
  const grouped: Record<string, Activity[]> = {};

  activities.forEach((activity) => {
    const date = activity.date;
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(activity);
  });

  // Sort activities by time within each date
  for (const date in grouped) {
    grouped[date].sort((a, b) => (a.start_time || "").localeCompare(b.start_time || ""));
  }

  return grouped;
}
