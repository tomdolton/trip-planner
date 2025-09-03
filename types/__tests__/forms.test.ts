import { z } from "zod";

import {
  tripSchema,
  activityFormSchema,
  accommodationFormSchema,
  locationFormSchema,
  journeyFormSchema,
  tripPhaseFormSchema,
} from "../forms";

describe("Form Schemas", () => {
  describe("tripSchema", () => {
    it("validates a valid trip object", () => {
      const validTrip = {
        title: "My Trip",
        start_date: "2023-12-01",
        end_date: "2023-12-10",
        description: "A wonderful trip",
      };

      expect(() => tripSchema.parse(validTrip)).not.toThrow();
    });

    it("requires title", () => {
      const invalidTrip = {
        start_date: "2023-12-01",
      };

      expect(() => tripSchema.parse(invalidTrip)).toThrow(/Required/);
    });

    it("allows optional fields", () => {
      const minimalTrip = {
        title: "Minimal Trip",
      };

      expect(() => tripSchema.parse(minimalTrip)).not.toThrow();
    });

    it("validates with empty string title", () => {
      const invalidTrip = {
        title: "",
      };

      expect(() => tripSchema.parse(invalidTrip)).toThrow();
    });
  });

  describe("activityFormSchema", () => {
    it("validates a valid activity object", () => {
      const validActivity = {
        name: "Museum Visit",
        date: "2023-12-05",
        start_time: "09:00",
        end_time: "11:00",
        notes: "Don't forget camera",
        activity_type: "sightseeing" as const,
      };

      expect(() => activityFormSchema.parse(validActivity)).not.toThrow();
    });

    it("requires name and date", () => {
      const invalidActivity = {
        activity_type: "sightseeing" as const,
      };

      expect(() => activityFormSchema.parse(invalidActivity)).toThrow();
    });

    it("validates time order - end time must be after start time", () => {
      const invalidActivity = {
        name: "Museum Visit",
        date: "2023-12-05",
        start_time: "11:00",
        end_time: "09:00", // End time before start time
        activity_type: "sightseeing" as const,
      };

      expect(() => activityFormSchema.parse(invalidActivity)).toThrow(
        "End time must be after start time"
      );
    });

    it("allows same start and end time", () => {
      const validActivity = {
        name: "Quick Stop",
        date: "2023-12-05",
        start_time: "10:00",
        end_time: "10:00",
        activity_type: "sightseeing" as const,
      };

      expect(() => activityFormSchema.parse(validActivity)).not.toThrow();
    });

    it("allows only start time without end time", () => {
      const validActivity = {
        name: "Museum Visit",
        date: "2023-12-05",
        start_time: "09:00",
        activity_type: "sightseeing" as const,
      };

      expect(() => activityFormSchema.parse(validActivity)).not.toThrow();
    });

    it("allows only end time without start time", () => {
      const validActivity = {
        name: "Museum Visit",
        date: "2023-12-05",
        end_time: "11:00",
        activity_type: "sightseeing" as const,
      };

      expect(() => activityFormSchema.parse(validActivity)).not.toThrow();
    });
  });

  describe("accommodationFormSchema", () => {
    it("validates a valid accommodation object", () => {
      const validAccommodation = {
        name: "Hotel Paradise",
        check_in: "2023-12-01",
        check_out: "2023-12-05",
        url: "https://hotel-paradise.com",
        notes: "Great location",
      };

      expect(() => accommodationFormSchema.parse(validAccommodation)).not.toThrow();
    });

    it("requires name", () => {
      const invalidAccommodation = {
        check_in: "2023-12-01",
      };

      expect(() => accommodationFormSchema.parse(invalidAccommodation)).toThrow(/Required/);
    });

    it("validates date order - check_out must be after check_in", () => {
      const invalidAccommodation = {
        name: "Hotel Paradise",
        check_in: "2023-12-05",
        check_out: "2023-12-01", // Check out before check in
      };

      expect(() => accommodationFormSchema.parse(invalidAccommodation)).toThrow(
        "Check-out date must be after check-in date"
      );
    });

    it("allows same check_in and check_out dates", () => {
      const validAccommodation = {
        name: "Hotel Paradise",
        check_in: "2023-12-01",
        check_out: "2023-12-01",
      };

      expect(() => accommodationFormSchema.parse(validAccommodation)).not.toThrow();
    });

    it("validates URL format", () => {
      const invalidAccommodation = {
        name: "Hotel Paradise",
        url: "not-a-valid-url",
      };

      expect(() => accommodationFormSchema.parse(invalidAccommodation)).toThrow(
        "Must be a valid URL"
      );
    });

    it("allows empty string for URL", () => {
      const validAccommodation = {
        name: "Hotel Paradise",
        url: "",
      };

      expect(() => accommodationFormSchema.parse(validAccommodation)).not.toThrow();
    });

    it("allows undefined URL", () => {
      const validAccommodation = {
        name: "Hotel Paradise",
      };

      expect(() => accommodationFormSchema.parse(validAccommodation)).not.toThrow();
    });
  });

  describe("locationFormSchema", () => {
    it("validates a valid location object", () => {
      const validLocation = {
        name: "Paris",
        region: "Île-de-France",
        notes: "City of lights",
        phaseId: "phase-123",
      };

      expect(() => locationFormSchema.parse(validLocation)).not.toThrow();
    });

    it("requires name", () => {
      const invalidLocation = {
        region: "Île-de-France",
      };

      expect(() => locationFormSchema.parse(invalidLocation)).toThrow(/Required/);
    });

    it("allows optional fields", () => {
      const minimalLocation = {
        name: "Paris",
      };

      expect(() => locationFormSchema.parse(minimalLocation)).not.toThrow();
    });
  });

  describe("journeyFormSchema", () => {
    it("validates a valid journey object", () => {
      const validJourney = {
        provider: "Air France",
        mode: "flight",
        departure_date: "2023-12-01",
        departure_time: "08:00",
        arrival_date: "2023-12-01",
        arrival_time: "12:00",
        notes: "Window seat preferred",
        departure_place_id: "dep-123",
        arrival_place_id: "arr-456",
      };

      expect(() => journeyFormSchema.parse(validJourney)).not.toThrow();
    });

    it("requires mode", () => {
      const invalidJourney = {
        provider: "Air France",
      };

      expect(() => journeyFormSchema.parse(invalidJourney)).toThrow(/Required/);
    });

    it("allows optional fields", () => {
      const minimalJourney = {
        mode: "flight",
      };

      expect(() => journeyFormSchema.parse(minimalJourney)).not.toThrow();
    });
  });

  describe("tripPhaseFormSchema", () => {
    it("validates a valid trip phase object", () => {
      const validPhase = {
        title: "Paris Visit",
        description: "Exploring the city",
        start_date: "2023-12-01",
        end_date: "2023-12-05",
      };

      expect(() => tripPhaseFormSchema.parse(validPhase)).not.toThrow();
    });

    it("requires title", () => {
      const invalidPhase = {
        description: "Exploring the city",
      };

      expect(() => tripPhaseFormSchema.parse(invalidPhase)).toThrow(/Required/);
    });

    it("allows empty string for dates", () => {
      const validPhase = {
        title: "Paris Visit",
        start_date: "",
        end_date: "",
      };

      expect(() => tripPhaseFormSchema.parse(validPhase)).not.toThrow();
    });

    it("allows undefined dates", () => {
      const validPhase = {
        title: "Paris Visit",
      };

      expect(() => tripPhaseFormSchema.parse(validPhase)).not.toThrow();
    });
  });

  describe("Schema type inference", () => {
    it("infers correct types from schemas", () => {
      // Test that the schemas produce the expected types
      type TripType = z.infer<typeof tripSchema>;
      type ActivityType = z.infer<typeof activityFormSchema>;
      type AccommodationType = z.infer<typeof accommodationFormSchema>;
      type LocationType = z.infer<typeof locationFormSchema>;
      type JourneyType = z.infer<typeof journeyFormSchema>;
      type TripPhaseType = z.infer<typeof tripPhaseFormSchema>;

      // These should compile without errors if types are correct
      const trip: TripType = { title: "Test" };
      const activity: ActivityType = { name: "Test", date: "2023-12-01", activity_type: "food" };
      const accommodation: AccommodationType = { name: "Test" };
      const location: LocationType = { name: "Test" };
      const journey: JourneyType = { mode: "car" };
      const phase: TripPhaseType = { title: "Test" };

      expect(trip.title).toBe("Test");
      expect(activity.name).toBe("Test");
      expect(accommodation.name).toBe("Test");
      expect(location.name).toBe("Test");
      expect(journey.mode).toBe("car");
      expect(phase.title).toBe("Test");
    });
  });
});
