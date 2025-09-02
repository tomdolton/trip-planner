import { JourneyFormValues } from "@/types/forms";
import { Location, Journey, TripPhase } from "@/types/trip";

import {
  combineDateTimeFields,
  splitDateTime,
  getLocationDisplayName,
  isStartJourney,
  isEndJourney,
  getLastLocationOfPhase,
  getFirstLocationOfPhase,
} from "../journeyUtils";

describe("journeyUtils", () => {
  describe("combineDateTimeFields", () => {
    it("should combine date and time fields correctly", () => {
      const values: JourneyFormValues = {
        mode: "train",
        departure_date: "2024-01-15",
        departure_time: "14:30",
        arrival_date: "2024-01-15",
        arrival_time: "16:45",
      };

      const result = combineDateTimeFields(values);

      expect(result).toEqual({
        departureDateTime: "2024-01-15T14:30",
        arrivalDateTime: "2024-01-15T16:45",
      });
    });

    it("should handle missing date or time fields", () => {
      const values: JourneyFormValues = {
        mode: "train",
        departure_date: "2024-01-15",
        departure_time: undefined,
        arrival_date: undefined,
        arrival_time: "16:45",
      };

      const result = combineDateTimeFields(values);

      expect(result).toEqual({
        departureDateTime: undefined,
        arrivalDateTime: undefined,
      });
    });

    it("should handle empty values", () => {
      const values: JourneyFormValues = {
        mode: "train",
      };

      const result = combineDateTimeFields(values);

      expect(result).toEqual({
        departureDateTime: undefined,
        arrivalDateTime: undefined,
      });
    });
  });

  describe("splitDateTime", () => {
    it("should split datetime string correctly", () => {
      const result = splitDateTime("2024-01-15T14:30:00");

      expect(result).toEqual({
        date: "2024-01-15",
        time: "14:30",
      });
    });

    it("should handle datetime without seconds", () => {
      const result = splitDateTime("2024-01-15T14:30");

      expect(result).toEqual({
        date: "2024-01-15",
        time: "14:30",
      });
    });

    it("should handle undefined datetime", () => {
      const result = splitDateTime(undefined);

      expect(result).toEqual({
        date: "",
        time: "",
      });
    });

    it("should handle malformed datetime", () => {
      const result = splitDateTime("invalid-date");

      expect(result).toEqual({
        date: "invalid-date",
        time: "",
      });
    });
  });

  describe("getLocationDisplayName", () => {
    const mockLocation: Location = {
      id: "1",
      trip_id: "trip-1",
      name: "Tokyo Station",
      place_id: "place-123",
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    };

    it("should return location name when location exists", () => {
      const result = getLocationDisplayName(mockLocation);
      expect(result).toBe("Tokyo Station");
    });

    it('should return "Start" when location is null and fromLocation is null', () => {
      const result = getLocationDisplayName(null, null);
      expect(result).toBe("Start");
    });

    it('should return "End" when location is null and fromLocation is provided', () => {
      const result = getLocationDisplayName(null, mockLocation);
      expect(result).toBe("End");
    });

    it('should return "End" when location is undefined', () => {
      const result = getLocationDisplayName(undefined);
      expect(result).toBe("End");
    });
  });

  describe("isStartJourney", () => {
    it("should return true for journey with null departure_location_id", () => {
      const journey: Journey = {
        id: "1",
        trip_id: "trip-1",
        departure_location_id: null,
        arrival_location_id: "2",
        mode: "train",
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      };

      expect(isStartJourney(journey)).toBe(true);
    });

    it("should return false for journey with departure_location_id", () => {
      const journey: Journey = {
        id: "1",
        trip_id: "trip-1",
        departure_location_id: "1",
        arrival_location_id: "2",
        mode: "train",
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      };

      expect(isStartJourney(journey)).toBe(false);
    });
  });

  describe("isEndJourney", () => {
    it("should return true for journey with null arrival_location_id", () => {
      const journey: Journey = {
        id: "1",
        trip_id: "trip-1",
        departure_location_id: "1",
        arrival_location_id: null,
        mode: "train",
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      };

      expect(isEndJourney(journey)).toBe(true);
    });

    it("should return false for journey with arrival_location_id", () => {
      const journey: Journey = {
        id: "1",
        trip_id: "trip-1",
        departure_location_id: "1",
        arrival_location_id: "2",
        mode: "train",
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      };

      expect(isEndJourney(journey)).toBe(false);
    });
  });

  describe("getLastLocationOfPhase", () => {
    const mockLocations: Location[] = [
      {
        id: "1",
        trip_id: "trip-1",
        name: "Tokyo",
        place_id: "place-1",
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      },
      {
        id: "2",
        trip_id: "trip-1",
        name: "Kyoto",
        place_id: "place-2",
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      },
    ];

    it("should return last location when locations exist", () => {
      const phase: TripPhase = {
        id: "1",
        trip_id: "trip-1",
        title: "Japan Trip",
        start_date: "2024-01-01",
        end_date: "2024-01-10",
        locations: mockLocations,
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      };

      const result = getLastLocationOfPhase(phase);
      expect(result).toEqual(mockLocations[1]);
    });

    it("should return null when no locations exist", () => {
      const phase: TripPhase = {
        id: "1",
        trip_id: "trip-1",
        title: "Japan Trip",
        start_date: "2024-01-01",
        end_date: "2024-01-10",
        locations: [],
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      };

      const result = getLastLocationOfPhase(phase);
      expect(result).toBeNull();
    });

    it("should return null when locations is undefined", () => {
      const phase = { locations: undefined };

      const result = getLastLocationOfPhase(phase);
      expect(result).toBeNull();
    });
  });

  describe("getFirstLocationOfPhase", () => {
    const mockLocations: Location[] = [
      {
        id: "1",
        trip_id: "trip-1",
        name: "Tokyo",
        place_id: "place-1",
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      },
      {
        id: "2",
        trip_id: "trip-1",
        name: "Kyoto",
        place_id: "place-2",
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      },
    ];

    it("should return first location when locations exist", () => {
      const phase: TripPhase = {
        id: "1",
        trip_id: "trip-1",
        title: "Japan Trip",
        start_date: "2024-01-01",
        end_date: "2024-01-10",
        locations: mockLocations,
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      };

      const result = getFirstLocationOfPhase(phase);
      expect(result).toEqual(mockLocations[0]);
    });

    it("should return null when no locations exist", () => {
      const phase: TripPhase = {
        id: "1",
        trip_id: "trip-1",
        title: "Japan Trip",
        start_date: "2024-01-01",
        end_date: "2024-01-10",
        locations: [],
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      };

      const result = getFirstLocationOfPhase(phase);
      expect(result).toBeNull();
    });

    it("should return null when locations is undefined", () => {
      const phase = { locations: undefined };

      const result = getFirstLocationOfPhase(phase);
      expect(result).toBeNull();
    });
  });
});
