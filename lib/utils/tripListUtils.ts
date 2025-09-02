import { Trip } from "@/types/trip";

import { TripsFilter } from "@/components/TripsDashboard/TripsFilterTabs";

/**
 * Filters an array of trips based on the selected filter type.
 *
 * @param trips - The array of Trip objects to filter.
 * @param filter - The filter type: "upcoming", "past", or "all".
 * @param now - The current date (defaults to now). Used for date comparisons.
 * @returns The filtered array of trips.
 *
 * - "upcoming": Returns trips with start_date that haven't ended yet (no end_date or end_date >= now).
 * - "past": Returns trips where end_date is set and in the past.
 * - "all": Returns all trips.
 */
export function filterTrips(trips: Trip[], filter: TripsFilter, now: Date = new Date()): Trip[] {
  if (filter === "all") return trips;
  if (filter === "upcoming") {
    return trips.filter(
      (trip) => trip.start_date && (!trip.end_date || new Date(trip.end_date) >= now)
    );
  }
  if (filter === "past") {
    return trips.filter((trip) => trip.end_date && new Date(trip.end_date) < now);
  }
  return trips;
}

/**
 * Sorts an array of trips by priority:
 *   1. Trips with a start_date come before those without.
 *   2. Among trips with start_date, sorts by start_date descending (most future first).
 *   3. If start_date is equal, sorts by end_date descending (most future first).
 *   4. Trips with no dates are sorted by created_at descending (most recently created first).
 *   5. If only one trip has created_at, it comes first.
 *   6. If neither has dates, keeps original order.
 *
 * @param trips - The array of Trip objects to sort.
 * @returns The sorted array of trips.
 */
export function sortTrips(trips: Trip[]): Trip[] {
  return trips.slice().sort((a, b) => {
    const aHasStart = !!a.start_date;
    const bHasStart = !!b.start_date;
    if (aHasStart && bHasStart) {
      // Both have start_date: sort by start_date desc
      const startDiff = new Date(b.start_date!).getTime() - new Date(a.start_date!).getTime();
      if (startDiff !== 0) return startDiff;
      // If start_date equal, sort by end_date desc
      if (a.end_date && b.end_date) {
        const endDiff = new Date(b.end_date!).getTime() - new Date(a.end_date!).getTime();
        if (endDiff !== 0) return endDiff;
      }
    } else if (aHasStart) {
      // a has start_date, b does not: a comes first
      return -1;
    } else if (bHasStart) {
      // b has start_date, a does not: b comes first
      return 1;
    }
    // Neither has start_date: sort by created_at desc
    if (a.created_at && b.created_at) {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    // If only one has created_at, that one comes first
    if (a.created_at) return -1;
    if (b.created_at) return 1;
    // Otherwise, keep original order
    return 0;
  });
}
