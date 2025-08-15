import { Location } from "@/types/trip";

import { formatDateRange } from "./dateTime";

/**
 * Calculates the date range for a location based on all activities and accommodations within it.
 * Returns a formatted date range string or null if no dates are found.
 *
 * @param location - The location object containing activities and accommodations
 * @returns Formatted date range string (e.g., "01 Aug - 04 Aug 2025") or null
 */
export function getLocationDateRange(location: Location): string | null {
  const dates: string[] = [];

  // Collect activity dates
  if (location.activities) {
    location.activities.forEach((activity) => {
      if (activity.date) {
        dates.push(activity.date);
      }
    });
  }

  // Collect accommodation dates
  if (location.accommodations) {
    location.accommodations.forEach((accommodation) => {
      if (accommodation.check_in) {
        dates.push(accommodation.check_in);
      }
      if (accommodation.check_out) {
        dates.push(accommodation.check_out);
      }
    });
  }

  // If no dates found, return null
  if (dates.length === 0) {
    return null;
  }

  // Sort dates and get the earliest and latest
  const sortedDates = dates.sort();
  const startDate = sortedDates[0];
  const endDate = sortedDates[sortedDates.length - 1];

  // If only one date or same start and end date, return just the single date
  if (startDate === endDate) {
    return formatDateRange(startDate);
  }

  // Return formatted date range
  return formatDateRange(startDate, endDate);
}
