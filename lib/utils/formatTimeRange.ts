import { format, parse } from "date-fns";

/**
 * Formats a time string (HH:mm or HH:mm:ss) into 12-hour time.
 * Returns '–' if no valid time is provided.
 */
export function formatTime(time: string | undefined | null): string {
  if (!time) return "–";

  try {
    const parsed = parse(time, "HH:mm:ss", new Date());
    // fallback if only "HH:mm" was provided
    if (isNaN(parsed.getTime())) {
      return format(parse(time, "HH:mm", new Date()), "h:mm a");
    }

    return format(parsed, "h:mmaaa");
  } catch {
    return "–";
  }
}

/**
 * Formats a start and end time as a range.
 * e.g. "1:00 PM – 3:30 PM" or "1:00 PM" if only start
 */
export function formatTimeRange(start?: string | null, end?: string | null): string {
  const formattedStart = formatTime(start);
  const formattedEnd = formatTime(end);

  if (!start) return "–";
  if (!end || formattedEnd === "–") return formattedStart;

  return `${formattedStart} – ${formattedEnd}`;
}
