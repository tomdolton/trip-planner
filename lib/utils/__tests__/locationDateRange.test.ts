import type { Location, Activity, Accommodation } from "@/types/trip";

import { formatDateRange } from "../dateTime";
import { getLocationDateRange } from "../locationDateRange";

// Mock the dateTime utility
jest.mock("../dateTime", () => ({
  formatDateRange: jest.fn(),
}));

const mockFormatDateRange = formatDateRange as jest.MockedFunction<typeof formatDateRange>;

// Helper functions to create test objects with required fields
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

const createAccommodation = (overrides: Partial<Accommodation>): Accommodation => ({
  id: "test-id",
  trip_id: "trip-1",
  location_id: "loc-1",
  name: "Test Accommodation",
  created_at: "2024-01-01",
  updated_at: "2024-01-01",
  ...overrides,
});

describe("getLocationDateRange", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return null when location has no activities or accommodations", () => {
    const location: Location = {
      id: "loc-1",
      trip_id: "trip-1",
      name: "Test Location",
      place_id: "place-1",
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    };

    const result = getLocationDateRange(location);
    expect(result).toBeNull();
    expect(mockFormatDateRange).not.toHaveBeenCalled();
  });

  it("should return null when location has empty activities and accommodations arrays", () => {
    const location: Location = {
      id: "loc-1",
      trip_id: "trip-1",
      name: "Test Location",
      place_id: "place-1",
      activities: [],
      accommodations: [],
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    };

    const result = getLocationDateRange(location);
    expect(result).toBeNull();
    expect(mockFormatDateRange).not.toHaveBeenCalled();
  });

  it("should handle location with only activity dates", () => {
    const activities: Activity[] = [
      createActivity({ id: "act-1", name: "Activity 1", date: "2024-01-15" }),
      createActivity({ id: "act-2", name: "Activity 2", date: "2024-01-17" }),
    ];

    const location: Location = {
      id: "loc-1",
      trip_id: "trip-1",
      name: "Test Location",
      place_id: "place-1",
      activities,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    };

    mockFormatDateRange.mockReturnValue("15 Jan - 17 Jan 2024");

    const result = getLocationDateRange(location);

    expect(mockFormatDateRange).toHaveBeenCalledWith("2024-01-15", "2024-01-17");
    expect(result).toBe("15 Jan - 17 Jan 2024");
  });

  it("should handle location with only accommodation dates", () => {
    const accommodations: Accommodation[] = [
      createAccommodation({
        id: "acc-1",
        name: "Hotel 1",
        check_in: "2024-01-10",
        check_out: "2024-01-12",
      }),
    ];

    const location: Location = {
      id: "loc-1",
      trip_id: "trip-1",
      name: "Test Location",
      place_id: "place-1",
      accommodations,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    };

    mockFormatDateRange.mockReturnValue("10 Jan - 12 Jan 2024");

    const result = getLocationDateRange(location);

    expect(mockFormatDateRange).toHaveBeenCalledWith("2024-01-10", "2024-01-12");
    expect(result).toBe("10 Jan - 12 Jan 2024");
  });

  it("should combine activity and accommodation dates", () => {
    const activities: Activity[] = [
      createActivity({ id: "act-1", name: "Activity 1", date: "2024-01-15" }),
    ];

    const accommodations: Accommodation[] = [
      createAccommodation({
        id: "acc-1",
        name: "Hotel 1",
        check_in: "2024-01-10",
        check_out: "2024-01-20",
      }),
    ];

    const location: Location = {
      id: "loc-1",
      trip_id: "trip-1",
      name: "Test Location",
      place_id: "place-1",
      activities,
      accommodations,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    };

    mockFormatDateRange.mockReturnValue("10 Jan - 20 Jan 2024");

    const result = getLocationDateRange(location);

    expect(mockFormatDateRange).toHaveBeenCalledWith("2024-01-10", "2024-01-20");
    expect(result).toBe("10 Jan - 20 Jan 2024");
  });

  it("should handle single date when start and end are the same", () => {
    const activities: Activity[] = [
      createActivity({ id: "act-1", name: "Activity 1", date: "2024-01-15" }),
    ];

    const location: Location = {
      id: "loc-1",
      trip_id: "trip-1",
      name: "Test Location",
      place_id: "place-1",
      activities,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    };

    mockFormatDateRange.mockReturnValue("15 Jan 2024");

    const result = getLocationDateRange(location);

    expect(mockFormatDateRange).toHaveBeenCalledWith("2024-01-15");
    expect(result).toBe("15 Jan 2024");
  });

  it("should ignore activities and accommodations without dates", () => {
    const activities: Activity[] = [
      createActivity({ id: "act-1", name: "Activity 1", date: "2024-01-15" }),
      createActivity({ id: "act-2", name: "Activity 2", date: undefined }),
    ];

    const accommodations: Accommodation[] = [
      createAccommodation({
        id: "acc-1",
        name: "Hotel 1",
        check_in: "2024-01-10",
        // No check_out
      }),
      createAccommodation({
        id: "acc-2",
        name: "Hotel 2",
        // No check_in or check_out
      }),
    ];

    const location: Location = {
      id: "loc-1",
      trip_id: "trip-1",
      name: "Test Location",
      place_id: "place-1",
      activities,
      accommodations,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    };

    mockFormatDateRange.mockReturnValue("10 Jan - 15 Jan 2024");

    const result = getLocationDateRange(location);

    expect(mockFormatDateRange).toHaveBeenCalledWith("2024-01-10", "2024-01-15");
    expect(result).toBe("10 Jan - 15 Jan 2024");
  });

  it("should sort dates properly", () => {
    const activities: Activity[] = [
      createActivity({ id: "act-1", name: "Activity 1", date: "2024-01-20" }), // Later date first
      createActivity({ id: "act-2", name: "Activity 2", date: "2024-01-10" }), // Earlier date second
    ];

    const accommodations: Accommodation[] = [
      createAccommodation({
        id: "acc-1",
        name: "Hotel 1",
        check_in: "2024-01-25", // Even later
        check_out: "2024-01-05", // Earliest of all
      }),
    ];

    const location: Location = {
      id: "loc-1",
      trip_id: "trip-1",
      name: "Test Location",
      place_id: "place-1",
      activities,
      accommodations,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    };

    mockFormatDateRange.mockReturnValue("05 Jan - 25 Jan 2024");

    const result = getLocationDateRange(location);

    // Should use earliest (2024-01-05) and latest (2024-01-25) dates
    expect(mockFormatDateRange).toHaveBeenCalledWith("2024-01-05", "2024-01-25");
    expect(result).toBe("05 Jan - 25 Jan 2024");
  });
});
