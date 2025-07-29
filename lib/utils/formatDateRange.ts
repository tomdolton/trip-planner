import { format, parseISO } from "date-fns";

/**
 * Formats a date or date range from YYYY-MM-DD strings.
 * @param startDate - Required ISO string (YYYY-MM-DD)
 * @param endDate - Optional ISO string (YYYY-MM-DD)
 */
export function formatDateRange(startDate?: string, endDate?: string): string {
  if (!startDate) return "No date set";

  const formattedStart = format(parseISO(startDate), "dd MMM yyyy");

  if (!endDate) {
    return formattedStart;
  }

  const formattedEnd = format(parseISO(endDate), "dd MMM yyyy");

  return `${formattedStart} - ${formattedEnd}`;
}
