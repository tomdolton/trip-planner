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
