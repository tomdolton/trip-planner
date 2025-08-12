export function normalizeTime(value?: string): string | null {
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
