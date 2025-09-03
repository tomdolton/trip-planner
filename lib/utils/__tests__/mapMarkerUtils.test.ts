import type { MarkerType, MapMarker } from "@/types/map-marker";
import type { Trip, Location as TripLocation, Activity } from "@/types/trip";

import { formatDateRange, formatDateWithDay } from "../dateTime";
import {
  generateMapMarkers,
  getMarkerTypeLabel,
  getMarkerDateInfo,
  getTargetIdForMarker,
} from "../mapMarkerUtils";

// Mock the dateTime utilities
jest.mock("../dateTime", () => ({
  formatDateRange: jest.fn(),
  formatDateWithDay: jest.fn(),
  formatDateTime: jest.fn(),
}));

const mockFormatDateRange = formatDateRange as jest.MockedFunction<typeof formatDateRange>;
const mockFormatDateWithDay = formatDateWithDay as jest.MockedFunction<typeof formatDateWithDay>;

// Helper functions to create test objects
const createLocation = (overrides: Partial<TripLocation>): TripLocation => ({
  id: "loc-1",
  trip_id: "trip-1",
  name: "Test Location",
  place_id: "place-1",
  created_at: "2024-01-01",
  updated_at: "2024-01-01",
  place: {
    id: "place-1",
    name: "Test Place",
    lat: 35.6812,
    lng: 139.7671,
    is_google_place: true,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  ...overrides,
});

const createActivity = (overrides: Partial<Activity>): Activity => ({
  id: "act-1",
  trip_id: "trip-1",
  location_id: "loc-1",
  user_id: "user-1",
  name: "Test Activity",
  date: "2024-01-15",
  activity_type: "sightseeing",
  created_at: "2024-01-01",
  updated_at: "2024-01-01",
  ...overrides,
});

describe("mapMarkerUtils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("generateMapMarkers", () => {
    it("should generate markers for location with place coordinates", () => {
      const location = createLocation({
        id: "loc-1",
        name: "Tokyo Station",
      });

      const trip: Trip = {
        id: "trip-1",
        title: "Test Trip",
        trip_phases: [
          {
            id: "phase-1",
            trip_id: "trip-1",
            title: "Phase 1",
            locations: [location],
            created_at: "2024-01-01",
            updated_at: "2024-01-01",
          },
        ],
      };

      const markers = generateMapMarkers(trip);

      expect(markers).toHaveLength(1);
      expect(markers[0]).toEqual({
        id: "location-loc-1",
        name: "Tokyo Station",
        lat: 35.6812,
        lng: 139.7671,
        type: "location",
        phaseIndex: 0,
        phaseName: "Phase 1",
        parentLocation: {
          ...location,
          phaseIndex: 0,
          phaseName: "Phase 1",
        },
      });
    });

    it("should handle empty trip", () => {
      const trip: Trip = {
        id: "trip-1",
        title: "Empty Trip",
      };

      const markers = generateMapMarkers(trip);
      expect(markers).toHaveLength(0);
    });
  });

  describe("getMarkerTypeLabel", () => {
    it("should return correct labels for all marker types", () => {
      const testCases: Array<[MarkerType, string]> = [
        ["location", "Location"],
        ["activity", "Activity"],
        ["accommodation", "Accommodation"],
        ["journey_departure", "Journey Departure"],
        ["journey_arrival", "Journey Arrival"],
      ];

      testCases.forEach(([type, expectedLabel]) => {
        expect(getMarkerTypeLabel(type)).toBe(expectedLabel);
      });
    });
  });

  describe("getMarkerDateInfo", () => {
    beforeEach(() => {
      mockFormatDateWithDay.mockReturnValue("15 Jan 2024, Monday");
      mockFormatDateRange.mockReturnValue("10 Jan - 12 Jan 2024");
    });

    it("should return formatted date for activity marker", () => {
      const activity = createActivity({
        id: "act-1",
        date: "2024-01-15",
      });

      const location = createLocation({
        activities: [activity],
      });

      const marker: MapMarker = {
        id: "activity-act-1",
        name: "Test Activity",
        lat: 0,
        lng: 0,
        type: "activity",
        phaseIndex: 0,
        phaseName: "Phase 1",
        parentLocation: location,
      };

      const trip: Trip = {
        id: "trip-1",
        title: "Test Trip",
      };

      const result = getMarkerDateInfo(marker, trip);

      expect(mockFormatDateWithDay).toHaveBeenCalledWith("2024-01-15");
      expect(result).toBe("15 Jan 2024, Monday");
    });

    it("should return null for location marker", () => {
      const marker: MapMarker = {
        id: "location-loc-1",
        name: "Test Location",
        lat: 0,
        lng: 0,
        type: "location",
        phaseIndex: 0,
        phaseName: "Phase 1",
      };

      const trip: Trip = {
        id: "trip-1",
        title: "Test Trip",
      };

      const result = getMarkerDateInfo(marker, trip);
      expect(result).toBeNull();
    });
  });

  describe("getTargetIdForMarker", () => {
    it("should return journey card ID for journey departure marker", () => {
      const marker: MapMarker = {
        id: "journey-departure-journey-123",
        name: "Departure",
        lat: 0,
        lng: 0,
        type: "journey_departure",
        phaseIndex: 0,
        phaseName: "Phase 1",
      };

      const result = getTargetIdForMarker(marker);
      expect(result).toBe("journey-journey-123");
    });

    it("should return marker ID for non-journey markers", () => {
      const marker: MapMarker = {
        id: "location-loc-123",
        name: "Test Location",
        lat: 0,
        lng: 0,
        type: "location",
        phaseIndex: 0,
        phaseName: "Phase 1",
      };

      const result = getTargetIdForMarker(marker);
      expect(result).toBe("location-loc-123");
    });
  });
});
