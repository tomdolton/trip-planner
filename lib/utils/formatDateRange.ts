import { format, parseISO, getYear } from "date-fns";

/**
 * Formats a date or date range from YYYY-MM-DD strings.
 * @param startDate - Required ISO string (YYYY-MM-DD)
 * @param endDate - Optional ISO string (YYYY-MM-DD)
 */
export function formatDateRange(startDate?: string, endDate?: string): string {
  if (!startDate) return "No date set";

  const startDateObj = parseISO(startDate);
  const formattedStart = format(startDateObj, "dd MMM yyyy");

  if (!endDate) {
    return formattedStart;
  }

  const endDateObj = parseISO(endDate);
  const startYear = getYear(startDateObj);
  const endYear = getYear(endDateObj);

  // If same year, format without year on start date
  if (startYear === endYear) {
    const formattedStartNoYear = format(startDateObj, "dd MMM");
    const formattedEnd = format(endDateObj, "dd MMM yyyy");
    return `${formattedStartNoYear} - ${formattedEnd}`;
  }

  // Different years, show year on both dates
  const formattedEnd = format(endDateObj, "dd MMM yyyy");
  return `${formattedStart} - ${formattedEnd}`;
}
