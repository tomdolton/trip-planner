import { format, parseISO } from "date-fns";

/**
 * Formats a datetime string (ISO format) into a readable date and time.
 * Returns '-' if no valid datetime is provided.
 */
export function formatDateTime(dateTime: string | undefined | null): string {
  if (!dateTime) return "-";

  try {
    const parsed = parseISO(dateTime);
    return format(parsed, "dd MMM yyyy 'at' h:mm a");
  } catch {
    return "-";
  }
}

/**
 * Formats departure and arrival datetime as a range.
 * e.g. "01 Aug 2025 at 9:00 AM → 01 Aug 2025 at 3:30 PM"
 */
export function formatDateTimeRange(departure?: string | null, arrival?: string | null): string {
  const formattedDeparture = formatDateTime(departure);
  const formattedArrival = formatDateTime(arrival);

  if (!departure) return "-";
  if (!arrival || formattedArrival === "-") return formattedDeparture;

  return `${formattedDeparture} → ${formattedArrival}`;
}
