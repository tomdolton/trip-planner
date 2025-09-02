import { Trip } from "@/types/trip";

import { filterTrips, sortTrips } from "../tripListUtils";

describe("tripListUtils", () => {
  const mockTrips: Trip[] = [
    {
      id: "1",
      title: "Future Trip",
      start_date: "2025-06-01",
      end_date: "2025-06-15",
      created_at: "2024-01-01T00:00:00",
    },
    {
      id: "2",
      title: "Past Trip",
      start_date: "2023-06-01",
      end_date: "2023-06-15",
      created_at: "2024-01-02T00:00:00",
    },
    {
      id: "3",
      title: "Ongoing Trip",
      start_date: "2024-01-01",
      end_date: "2025-12-31",
      created_at: "2024-01-03T00:00:00",
    },
    {
      id: "4",
      title: "No End Date Trip",
      start_date: "2024-01-01",
      created_at: "2024-01-04T00:00:00",
    },
    {
      id: "5",
      title: "No Dates Trip",
      created_at: "2024-01-05T00:00:00",
    },
  ];

  describe("filterTrips", () => {
    const now = new Date("2024-06-01T12:00:00");

    it('should return all trips when filter is "all"', () => {
      const result = filterTrips(mockTrips, "all", now);
      expect(result).toEqual(mockTrips);
    });

    it('should return upcoming trips when filter is "upcoming"', () => {
      const result = filterTrips(mockTrips, "upcoming", now);
      expect(result).toHaveLength(3);
      expect(result).toEqual([
        mockTrips[0], // Future trip
        mockTrips[2], // Ongoing trip (ends in future)
        mockTrips[3], // No end date trip
      ]);
    });

    it('should return past trips when filter is "past"', () => {
      const result = filterTrips(mockTrips, "past", now);
      expect(result).toHaveLength(1);
      expect(result).toEqual([mockTrips[1]]); // Past trip
    });

    it("should handle trips without end_date as upcoming", () => {
      const tripsWithoutEndDate: Trip[] = [
        {
          id: "1",
          title: "Trip without end date",
          start_date: "2024-01-01",
        },
      ];

      const result = filterTrips(tripsWithoutEndDate, "upcoming", now);
      expect(result).toHaveLength(1);
    });

    it("should use current date as default", () => {
      // This test ensures the function works without providing a now parameter
      const result = filterTrips(mockTrips, "all");
      expect(result).toEqual(mockTrips);
    });
  });

  describe("sortTrips", () => {
    it("should sort trips with start dates by start_date descending", () => {
      const tripsWithDates: Trip[] = [
        {
          id: "1",
          title: "Earlier Trip",
          start_date: "2024-01-01",
          created_at: "2024-01-01T00:00:00",
        },
        {
          id: "2",
          title: "Later Trip",
          start_date: "2024-06-01",
          created_at: "2024-01-02T00:00:00",
        },
      ];

      const result = sortTrips(tripsWithDates);
      expect(result[0].id).toBe("2"); // Later trip should be first
      expect(result[1].id).toBe("1"); // Earlier trip should be second
    });

    it("should prioritize trips with start_date over those without", () => {
      const mixedTrips: Trip[] = [
        {
          id: "1",
          title: "No Start Date",
          created_at: "2024-01-01T00:00:00",
        },
        {
          id: "2",
          title: "Has Start Date",
          start_date: "2024-01-01",
          created_at: "2024-01-02T00:00:00",
        },
      ];

      const result = sortTrips(mixedTrips);
      expect(result[0].id).toBe("2"); // Trip with start_date should be first
      expect(result[1].id).toBe("1"); // Trip without start_date should be second
    });

    it("should sort by end_date when start_dates are equal", () => {
      const tripsWithSameStart: Trip[] = [
        {
          id: "1",
          title: "Earlier End",
          start_date: "2024-01-01",
          end_date: "2024-01-10",
          created_at: "2024-01-01T00:00:00",
        },
        {
          id: "2",
          title: "Later End",
          start_date: "2024-01-01",
          end_date: "2024-01-20",
          created_at: "2024-01-02T00:00:00",
        },
      ];

      const result = sortTrips(tripsWithSameStart);
      expect(result[0].id).toBe("2"); // Later end_date should be first
      expect(result[1].id).toBe("1"); // Earlier end_date should be second
    });

    it("should sort by created_at when no start_dates", () => {
      const tripsWithoutDates: Trip[] = [
        {
          id: "1",
          title: "Earlier Created",
          created_at: "2024-01-01T00:00:00",
        },
        {
          id: "2",
          title: "Later Created",
          created_at: "2024-01-02T00:00:00",
        },
      ];

      const result = sortTrips(tripsWithoutDates);
      expect(result[0].id).toBe("2"); // Later created_at should be first
      expect(result[1].id).toBe("1"); // Earlier created_at should be second
    });

    it("should handle trips with only one created_at", () => {
      const mixedTrips: Trip[] = [
        {
          id: "1",
          title: "No Created At",
        },
        {
          id: "2",
          title: "Has Created At",
          created_at: "2024-01-01T00:00:00",
        },
      ];

      const result = sortTrips(mixedTrips);
      expect(result[0].id).toBe("2"); // Trip with created_at should be first
    });

    it("should not mutate original array", () => {
      const originalTrips = [...mockTrips];
      const result = sortTrips(mockTrips);

      expect(mockTrips).toEqual(originalTrips); // Original should be unchanged
      expect(result).not.toBe(mockTrips); // Should return new array
    });
  });
});
