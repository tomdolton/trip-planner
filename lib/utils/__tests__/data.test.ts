import type { Activity } from "@/types/trip";

import { groupActivitiesByDate } from "../data";

// Helper function to create test activity
const createActivity = (overrides: Partial<Activity>): Activity => ({
  id: "test-id",
  trip_id: "trip-1",
  location_id: "loc-1",
  user_id: "user-1",
  name: "Test Activity",
  date: "2024-01-01",
  activity_type: "sightseeing",
  created_at: "2024-01-01",
  updated_at: "2024-01-01",
  ...overrides,
});

describe("groupActivitiesByDate", () => {
  it("should group activities by date correctly", () => {
    const activities: Activity[] = [
      createActivity({
        id: "act-1",
        name: "Morning Sightseeing",
        date: "2024-01-15",
        start_time: "09:00:00",
      }),
      createActivity({
        id: "act-2",
        name: "Lunch",
        date: "2024-01-15",
        start_time: "12:00:00",
      }),
      createActivity({
        id: "act-3",
        name: "Evening Walk",
        date: "2024-01-16",
        start_time: "18:00:00",
      }),
    ];

    const result = groupActivitiesByDate(activities);

    expect(result).toEqual({
      "2024-01-15": [
        createActivity({
          id: "act-1",
          name: "Morning Sightseeing",
          date: "2024-01-15",
          start_time: "09:00:00",
        }),
        createActivity({
          id: "act-2",
          name: "Lunch",
          date: "2024-01-15",
          start_time: "12:00:00",
        }),
      ],
      "2024-01-16": [
        createActivity({
          id: "act-3",
          name: "Evening Walk",
          date: "2024-01-16",
          start_time: "18:00:00",
        }),
      ],
    });
  });

  it("should handle empty activities array", () => {
    const activities: Activity[] = [];
    const result = groupActivitiesByDate(activities);
    expect(result).toEqual({});
  });

  it("should sort activities by time within each date", () => {
    const activities: Activity[] = [
      createActivity({
        id: "act-1",
        name: "Dinner",
        date: "2024-01-15",
        start_time: "19:00:00", // Evening
      }),
      createActivity({
        id: "act-2",
        name: "Lunch",
        date: "2024-01-15",
        start_time: "12:00:00", // Noon
      }),
      createActivity({
        id: "act-3",
        name: "Breakfast",
        date: "2024-01-15",
        start_time: "08:00:00", // Morning
      }),
    ];

    const result = groupActivitiesByDate(activities);

    // Activities should be sorted by start_time within the date
    expect(result["2024-01-15"]).toEqual([
      createActivity({
        id: "act-3",
        name: "Breakfast",
        date: "2024-01-15",
        start_time: "08:00:00",
      }),
      createActivity({
        id: "act-2",
        name: "Lunch",
        date: "2024-01-15",
        start_time: "12:00:00",
      }),
      createActivity({
        id: "act-1",
        name: "Dinner",
        date: "2024-01-15",
        start_time: "19:00:00",
      }),
    ]);
  });

  it("should handle activities without start_time", () => {
    const activities: Activity[] = [
      createActivity({
        id: "act-1",
        name: "Activity with time",
        date: "2024-01-15",
        start_time: "12:00:00",
      }),
      createActivity({
        id: "act-2",
        name: "Activity without time",
        date: "2024-01-15",
        start_time: undefined,
      }),
      createActivity({
        id: "act-3",
        name: "Another timed activity",
        date: "2024-01-15",
        start_time: "10:00:00",
      }),
    ];

    const result = groupActivitiesByDate(activities);

    // Activities without start_time should be sorted as empty strings (first)
    expect(result["2024-01-15"]).toEqual([
      createActivity({
        id: "act-2",
        name: "Activity without time",
        date: "2024-01-15",
        start_time: undefined,
      }),
      createActivity({
        id: "act-3",
        name: "Another timed activity",
        date: "2024-01-15",
        start_time: "10:00:00",
      }),
      createActivity({
        id: "act-1",
        name: "Activity with time",
        date: "2024-01-15",
        start_time: "12:00:00",
      }),
    ]);
  });

  it("should handle activities with same start_time", () => {
    const activities: Activity[] = [
      createActivity({
        id: "act-1",
        name: "First Activity",
        date: "2024-01-15",
        start_time: "12:00:00",
      }),
      createActivity({
        id: "act-2",
        name: "Second Activity",
        date: "2024-01-15",
        start_time: "12:00:00",
      }),
    ];

    const result = groupActivitiesByDate(activities);

    expect(result["2024-01-15"]).toHaveLength(2);
    expect(result["2024-01-15"]).toContainEqual(
      createActivity({
        id: "act-1",
        name: "First Activity",
        date: "2024-01-15",
        start_time: "12:00:00",
      })
    );
    expect(result["2024-01-15"]).toContainEqual(
      createActivity({
        id: "act-2",
        name: "Second Activity",
        date: "2024-01-15",
        start_time: "12:00:00",
      })
    );
  });

  it("should handle activities from multiple dates", () => {
    const activities: Activity[] = [
      createActivity({
        id: "act-1",
        name: "Day 1 Morning",
        date: "2024-01-15",
        start_time: "09:00:00",
      }),
      createActivity({
        id: "act-2",
        name: "Day 2 Afternoon",
        date: "2024-01-16",
        start_time: "14:00:00",
      }),
      createActivity({
        id: "act-3",
        name: "Day 1 Evening",
        date: "2024-01-15",
        start_time: "20:00:00",
      }),
      createActivity({
        id: "act-4",
        name: "Day 2 Morning",
        date: "2024-01-16",
        start_time: "08:00:00",
      }),
    ];

    const result = groupActivitiesByDate(activities);

    expect(Object.keys(result)).toHaveLength(2);
    expect(result["2024-01-15"]).toHaveLength(2);
    expect(result["2024-01-16"]).toHaveLength(2);

    // Check that each date's activities are sorted by time
    expect(result["2024-01-15"][0].start_time).toBe("09:00:00");
    expect(result["2024-01-15"][1].start_time).toBe("20:00:00");
    expect(result["2024-01-16"][0].start_time).toBe("08:00:00");
    expect(result["2024-01-16"][1].start_time).toBe("14:00:00");
  });

  it("should maintain original activity objects", () => {
    const originalActivity = createActivity({
      id: "act-1",
      name: "Test Activity",
      date: "2024-01-15",
      start_time: "12:00:00",
      activity_type: "food",
    });

    const activities: Activity[] = [originalActivity];
    const result = groupActivitiesByDate(activities);

    // Should be the same object reference
    expect(result["2024-01-15"][0]).toBe(originalActivity);
  });
});
