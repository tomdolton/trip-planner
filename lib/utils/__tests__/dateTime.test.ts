import {
  formatDateWithDay,
  formatDateRange,
  formatDateTime,
  formatDateTimeRange,
  formatTime,
  formatTimeRange,
  formatTimeForDisplay,
  normaliseTime,
  getDuration,
} from "../dateTime";

describe("dateTime utilities", () => {
  describe("formatDateWithDay", () => {
    it("should format date with day correctly", () => {
      const result = formatDateWithDay("2024-01-15");
      expect(result).toBe("Monday - 15/01/24");
    });

    it('should return "No date set" for empty date', () => {
      const result = formatDateWithDay("");
      expect(result).toBe("No date set");
    });
  });

  describe("formatDateRange", () => {
    it("should format single date", () => {
      const result = formatDateRange("2024-01-15");
      expect(result).toBe("15 Jan 2024");
    });

    it("should format date range in same year", () => {
      const result = formatDateRange("2024-01-15", "2024-03-20");
      expect(result).toBe("15 Jan - 20 Mar 2024");
    });

    it("should format date range in different years", () => {
      const result = formatDateRange("2024-01-15", "2025-03-20");
      expect(result).toBe("15 Jan 2024 - 20 Mar 2025");
    });

    it('should return "No date set" for empty start date', () => {
      const result = formatDateRange(undefined);
      expect(result).toBe("No date set");
    });
  });

  describe("formatDateTime", () => {
    it("should format datetime correctly", () => {
      const result = formatDateTime("2024-01-15T14:30:00");
      expect(result).toBe("15 Jan 2024 at 2:30 PM");
    });

    it('should return "-" for empty datetime', () => {
      const result = formatDateTime("");
      expect(result).toBe("-");
    });

    it('should return "-" for null datetime', () => {
      const result = formatDateTime(null);
      expect(result).toBe("-");
    });

    it('should return "-" for undefined datetime', () => {
      const result = formatDateTime(undefined);
      expect(result).toBe("-");
    });

    it('should return "-" for invalid datetime', () => {
      const result = formatDateTime("invalid-date");
      expect(result).toBe("-");
    });
  });

  describe("formatDateTimeRange", () => {
    it("should format datetime range correctly", () => {
      const result = formatDateTimeRange("2024-01-15T14:30:00", "2024-01-15T16:45:00");
      expect(result).toBe("15 Jan 2024 at 2:30 PM → 15 Jan 2024 at 4:45 PM");
    });

    it('should return "-" for empty departure', () => {
      const result = formatDateTimeRange("", "2024-01-15T16:45:00");
      expect(result).toBe("-");
    });

    it("should handle missing arrival", () => {
      const result = formatDateTimeRange("2024-01-15T14:30:00", "");
      expect(result).toBe("15 Jan 2024 at 2:30 PM");
    });
  });

  describe("formatTime", () => {
    it("should format time with seconds", () => {
      const result = formatTime("14:30:00");
      expect(result).toBe("14:30");
    });

    it("should format time without seconds", () => {
      const result = formatTime("14:30");
      expect(result).toBe("14:30");
    });

    it('should return "-" for empty time', () => {
      const result = formatTime("");
      expect(result).toBe("-");
    });

    it('should return "-" for null time', () => {
      const result = formatTime(null);
      expect(result).toBe("-");
    });

    it('should return "-" for invalid time', () => {
      const result = formatTime("invalid-time");
      expect(result).toBe("-");
    });
  });

  describe("formatTimeRange", () => {
    it("should format time range correctly", () => {
      const result = formatTimeRange("14:30:00", "16:45:00");
      expect(result).toBe("14:30 - 16:45");
    });

    it('should return "-" for empty start time', () => {
      const result = formatTimeRange("", "16:45:00");
      expect(result).toBe("-");
    });

    it("should handle missing end time", () => {
      const result = formatTimeRange("14:30:00", "");
      expect(result).toBe("14:30");
    });
  });

  describe("formatTimeForDisplay", () => {
    it("should format time for HTML input", () => {
      const result = formatTimeForDisplay("14:30:00");
      expect(result).toBe("14:30");
    });

    it("should handle time without seconds", () => {
      const result = formatTimeForDisplay("14:30");
      expect(result).toBe("14:30");
    });

    it("should return empty string for empty value", () => {
      const result = formatTimeForDisplay("");
      expect(result).toBe("");
    });

    it("should return empty string for undefined value", () => {
      const result = formatTimeForDisplay(undefined);
      expect(result).toBe("");
    });

    it("should return empty string for invalid time", () => {
      const result = formatTimeForDisplay("invalid");
      expect(result).toBe("");
    });
  });

  describe("normaliseTime", () => {
    it("should return time as-is if already in HH:MM:SS format", () => {
      const result = normaliseTime("14:30:00");
      expect(result).toBe("14:30:00");
    });

    it("should add seconds to HH:MM format", () => {
      const result = normaliseTime("14:30");
      expect(result).toBe("14:30:00");
    });

    it("should return null for empty value", () => {
      const result = normaliseTime("");
      expect(result).toBeNull();
    });

    it("should return null for undefined value", () => {
      const result = normaliseTime(undefined);
      expect(result).toBeNull();
    });

    it("should return null for invalid format", () => {
      const result = normaliseTime("invalid");
      expect(result).toBeNull();
    });
  });

  describe("getDuration", () => {
    it("should calculate duration in hours and minutes", () => {
      const result = getDuration("2024-01-15T14:30:00", "2024-01-15T16:45:00");
      expect(result).toBe("2 Hours 15m");
    });

    it("should calculate duration in hours only", () => {
      const result = getDuration("2024-01-15T14:00:00", "2024-01-15T16:00:00");
      expect(result).toBe("2 Hours");
    });

    it("should calculate duration in minutes only", () => {
      const result = getDuration("2024-01-15T14:00:00", "2024-01-15T14:30:00");
      expect(result).toBe("30 Minutes");
    });

    it("should handle single hour", () => {
      const result = getDuration("2024-01-15T14:00:00", "2024-01-15T15:00:00");
      expect(result).toBe("1 Hour");
    });

    it("should return null for missing departure time", () => {
      const result = getDuration(undefined, "2024-01-15T16:00:00");
      expect(result).toBeNull();
    });

    it("should return null for missing arrival time", () => {
      const result = getDuration("2024-01-15T14:00:00", undefined);
      expect(result).toBeNull();
    });

    it("should return null for invalid dates", () => {
      const result = getDuration("invalid-date", "2024-01-15T16:00:00");
      expect(result).toBeNull();
    });

    it("should return null for negative duration", () => {
      const result = getDuration("2024-01-15T16:00:00", "2024-01-15T14:00:00");
      expect(result).toBeNull();
    });
  });
});
