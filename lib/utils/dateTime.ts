import { format, parseISO, parse, getYear } from "date-fns";

// ============================
// DATE FORMATTING FUNCTIONS
// ============================

/**
 * Formats a date as "Monday - 01/08/25" format.
 * @param date - ISO string (YYYY-MM-DD)
 */
export function formatDateWithDay(date: string): string {
  if (!date) return "No date set";

  const dateObj = parseISO(date);
  return format(dateObj, "EEEE - dd/MM/yy");
}

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

// ============================
// TIME FORMATTING FUNCTIONS
// ============================

/**
 * Formats a time string (HH:mm or HH:mm:ss) into 12-hour time.
 * Returns '-' if no valid time is provided.
 */
export function formatTime(time: string | undefined | null): string {
  if (!time) return "-";

  try {
    let parsed = parse(time, "HH:mm:ss", new Date());
    // fallback if only "HH:mm" was provided
    if (isNaN(parsed.getTime())) {
      parsed = parse(time, "HH:mm", new Date());
    }
    if (isNaN(parsed.getTime())) return "-";
    return format(parsed, "HH:mm");
  } catch {
    return "-";
  }
}

/**
 * Formats a start and end time as a range.
 * e.g. "1:00 PM - 3:30 PM" or "1:00 PM" if only start
 */
export function formatTimeRange(start?: string | null, end?: string | null): string {
  const formattedStart = formatTime(start);
  const formattedEnd = formatTime(end);

  if (!start) return "-";
  if (!end || formattedEnd === "-") return formattedStart;

  return `${formattedStart} - ${formattedEnd}`;
}

/**
 * Formats time for display in HTML time inputs (HH:MM format)
 * Strips seconds from database time values
 */
export function formatTimeForDisplay(value?: string): string {
  if (!value || value.trim() === "") {
    return "";
  }

  // Extract HH:MM from any time format
  const timeParts = value.split(":");
  if (timeParts.length >= 2) {
    return `${timeParts[0]}:${timeParts[1]}`;
  }

  return "";
}

// ============================
// TIME NORMALIZATION FUNCTIONS
// ============================

/**
 * Normalises a time string to HH:MM:SS format
 * @param value - Time string in various formats (HH:MM or HH:MM:SS)
 * @returns Normalised time string in HH:MM:SS format or null if invalid
 */
export function normaliseTime(value?: string): string | null {
  if (!value || value.trim() === "") {
    return null;
  }

  // If already in HH:MM:SS format, return as is
  if (value.includes(":") && value.split(":").length === 3) {
    return value;
  }

  // If in HH:MM format, add seconds
  if (value.includes(":") && value.split(":").length === 2) {
    return `${value}:00`;
  }

  // If no colons, assume it's malformed, return null
  return null;
}

// ============================
// DURATION FUNCTIONS
// ============================

/**
 * Calculate the duration between two dates and format it as a human-readable string
 * @param departureTime - ISO string of departure time
 * @param arrivalTime - ISO string of arrival time
 * @returns Formatted duration string or null if times are invalid
 */
export function getDuration(departureTime?: string, arrivalTime?: string): string | null {
  if (!departureTime || !arrivalTime) {
    return null;
  }

  const departure = new Date(departureTime);
  const arrival = new Date(arrivalTime);

  // Validate dates
  if (isNaN(departure.getTime()) || isNaN(arrival.getTime())) {
    return null;
  }

  const diffMs = arrival.getTime() - departure.getTime();

  // Handle negative duration (arrival before departure)
  if (diffMs < 0) {
    return null;
  }

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHours > 0) {
    return `${diffHours} ${diffHours === 1 ? "Hour" : "Hours"}${diffMinutes > 0 ? ` ${diffMinutes}m` : ""}`;
  }
  return `${diffMinutes} Minutes`;
}
