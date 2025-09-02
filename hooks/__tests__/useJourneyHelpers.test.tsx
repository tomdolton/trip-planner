import { renderHook } from "@testing-library/react";

import { Journey, Location, TripPhase } from "@/types/trip";

import { useJourneyHelpers } from "../useJourneyHelpers";

describe("useJourneyHelpers", () => {
  // Mock data
  const mockLocation1: Location = {
    id: "location-1",
    name: "Paris",
    trip_id: "trip-123",
    trip_phase_id: "phase-1",
    order: 0,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  };

  const mockLocation2: Location = {
    id: "location-2",
    name: "Lyon",
    trip_id: "trip-123",
    trip_phase_id: "phase-1",
    order: 1,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  };

  const mockLocation3: Location = {
    id: "location-3",
    name: "Nice",
    trip_id: "trip-123",
    trip_phase_id: "phase-2",
    order: 0,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  };

  const mockPhase1: TripPhase = {
    id: "phase-1",
    trip_id: "trip-123",
    title: "Northern France",
    order: 0,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    locations: [mockLocation1, mockLocation2],
  };

  const mockPhase2: TripPhase = {
    id: "phase-2",
    trip_id: "trip-123",
    title: "Southern France",
    order: 1,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    locations: [mockLocation3],
  };

  const mockJourneys: Journey[] = [
    // Start journey to first location
    {
      id: "journey-start",
      trip_id: "trip-123",
      departure_location_id: null,
      arrival_location_id: "location-1",
      mode: "flight",
      departure_time: undefined,
      arrival_time: undefined,
      notes: "",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
    // Journey between locations in same phase
    {
      id: "journey-1-2",
      trip_id: "trip-123",
      departure_location_id: "location-1",
      arrival_location_id: "location-2",
      mode: "train",
      departure_time: undefined,
      arrival_time: undefined,
      notes: "",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
    // Cross-phase journey
    {
      id: "journey-2-3",
      trip_id: "trip-123",
      departure_location_id: "location-2",
      arrival_location_id: "location-3",
      mode: "car",
      departure_time: undefined,
      arrival_time: undefined,
      notes: "",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
    // End journey from last location
    {
      id: "journey-end",
      trip_id: "trip-123",
      departure_location_id: "location-3",
      arrival_location_id: null,
      mode: "flight",
      departure_time: undefined,
      arrival_time: undefined,
      notes: "",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
  ];

  describe("findJourney", () => {
    it("should find journey between two locations", () => {
      const { result } = renderHook(() =>
        useJourneyHelpers({
          journeys: mockJourneys,
          allPhases: [mockPhase1, mockPhase2],
          currentPhase: mockPhase1,
          phaseIndex: 0,
        })
      );

      const journey = result.current.findJourney("location-1", "location-2");
      expect(journey).toEqual(mockJourneys[1]);
    });

    it("should return undefined if journey not found", () => {
      const { result } = renderHook(() =>
        useJourneyHelpers({
          journeys: mockJourneys,
          allPhases: [mockPhase1, mockPhase2],
          currentPhase: mockPhase1,
          phaseIndex: 0,
        })
      );

      const journey = result.current.findJourney("location-1", "location-3");
      expect(journey).toBeUndefined();
    });

    it("should handle null location IDs", () => {
      const { result } = renderHook(() =>
        useJourneyHelpers({
          journeys: mockJourneys,
          allPhases: [mockPhase1, mockPhase2],
          currentPhase: mockPhase1,
          phaseIndex: 0,
        })
      );

      const journey = result.current.findJourney(null, "location-1");
      expect(journey).toEqual(mockJourneys[0]);
    });
  });

  describe("findStartJourney", () => {
    it("should find start journey for phase with locations", () => {
      const { result } = renderHook(() =>
        useJourneyHelpers({
          journeys: mockJourneys,
          allPhases: [mockPhase1, mockPhase2],
          currentPhase: mockPhase1,
          phaseIndex: 0,
        })
      );

      const journey = result.current.findStartJourney();
      expect(journey).toEqual(mockJourneys[0]);
    });

    it("should return null if no locations in phase", () => {
      const emptyPhase = { ...mockPhase1, locations: [] };
      const { result } = renderHook(() =>
        useJourneyHelpers({
          journeys: mockJourneys,
          allPhases: [mockPhase1, mockPhase2],
          currentPhase: emptyPhase,
          phaseIndex: 0,
        })
      );

      const journey = result.current.findStartJourney();
      expect(journey).toBeNull();
    });

    it("should return null if no start journey exists", () => {
      const journeysWithoutStart = mockJourneys.filter((j) => j.id !== "journey-start");
      const { result } = renderHook(() =>
        useJourneyHelpers({
          journeys: journeysWithoutStart,
          allPhases: [mockPhase1, mockPhase2],
          currentPhase: mockPhase1,
          phaseIndex: 0,
        })
      );

      const journey = result.current.findStartJourney();
      expect(journey).toBeUndefined();
    });
  });

  describe("findEndJourney", () => {
    it("should find end journey for phase with locations", () => {
      const { result } = renderHook(() =>
        useJourneyHelpers({
          journeys: mockJourneys,
          allPhases: [mockPhase1, mockPhase2],
          currentPhase: mockPhase2,
          phaseIndex: 1,
        })
      );

      const journey = result.current.findEndJourney();
      expect(journey).toEqual(mockJourneys[3]);
    });

    it("should return null if no locations in phase", () => {
      const emptyPhase = { ...mockPhase2, locations: [] };
      const { result } = renderHook(() =>
        useJourneyHelpers({
          journeys: mockJourneys,
          allPhases: [mockPhase1, mockPhase2],
          currentPhase: emptyPhase,
          phaseIndex: 1,
        })
      );

      const journey = result.current.findEndJourney();
      expect(journey).toBeNull();
    });
  });

  describe("findCrossPhaseJourneyToNext", () => {
    it("should find cross-phase journey to next phase", () => {
      const { result } = renderHook(() =>
        useJourneyHelpers({
          journeys: mockJourneys,
          allPhases: [mockPhase1, mockPhase2],
          currentPhase: mockPhase1,
          phaseIndex: 0,
        })
      );

      const journey = result.current.findCrossPhaseJourneyToNext();
      expect(journey).toEqual(mockJourneys[2]);
    });

    it("should return null for last phase", () => {
      const { result } = renderHook(() =>
        useJourneyHelpers({
          journeys: mockJourneys,
          allPhases: [mockPhase1, mockPhase2],
          currentPhase: mockPhase2,
          phaseIndex: 1,
        })
      );

      const journey = result.current.findCrossPhaseJourneyToNext();
      expect(journey).toBeNull();
    });

    it("should return null if no allPhases provided", () => {
      const { result } = renderHook(() =>
        useJourneyHelpers({
          journeys: mockJourneys,
          allPhases: undefined,
          currentPhase: mockPhase1,
          phaseIndex: 0,
        })
      );

      const journey = result.current.findCrossPhaseJourneyToNext();
      expect(journey).toBeNull();
    });

    it("should return null if no locations in phases", () => {
      const emptyPhase1 = { ...mockPhase1, locations: [] };
      const { result } = renderHook(() =>
        useJourneyHelpers({
          journeys: mockJourneys,
          allPhases: [emptyPhase1, mockPhase2],
          currentPhase: emptyPhase1,
          phaseIndex: 0,
        })
      );

      const journey = result.current.findCrossPhaseJourneyToNext();
      expect(journey).toBeNull();
    });
  });

  describe("getCrossPhaseJourneyLocationsToNext", () => {
    it("should get cross-phase journey locations", () => {
      const { result } = renderHook(() =>
        useJourneyHelpers({
          journeys: mockJourneys,
          allPhases: [mockPhase1, mockPhase2],
          currentPhase: mockPhase1,
          phaseIndex: 0,
        })
      );

      const locations = result.current.getCrossPhaseJourneyLocationsToNext();
      expect(locations).toEqual({
        fromLocation: mockLocation2,
        toLocation: mockLocation3,
        nextPhase: mockPhase2,
      });
    });

    it("should return null for last phase", () => {
      const { result } = renderHook(() =>
        useJourneyHelpers({
          journeys: mockJourneys,
          allPhases: [mockPhase1, mockPhase2],
          currentPhase: mockPhase2,
          phaseIndex: 1,
        })
      );

      const locations = result.current.getCrossPhaseJourneyLocationsToNext();
      expect(locations).toBeNull();
    });
  });

  describe("shouldShowCrossPhaseJourney", () => {
    it("should return true when cross-phase journey should be shown", () => {
      const { result } = renderHook(() =>
        useJourneyHelpers({
          journeys: mockJourneys,
          allPhases: [mockPhase1, mockPhase2],
          currentPhase: mockPhase1,
          phaseIndex: 0,
        })
      );

      expect(result.current.shouldShowCrossPhaseJourney()).toBe(true);
    });

    it("should return false for last phase", () => {
      const { result } = renderHook(() =>
        useJourneyHelpers({
          journeys: mockJourneys,
          allPhases: [mockPhase1, mockPhase2],
          currentPhase: mockPhase2,
          phaseIndex: 1,
        })
      );

      expect(result.current.shouldShowCrossPhaseJourney()).toBe(false);
    });

    it("should return false with single phase", () => {
      const { result } = renderHook(() =>
        useJourneyHelpers({
          journeys: mockJourneys,
          allPhases: [mockPhase1],
          currentPhase: mockPhase1,
          phaseIndex: 0,
        })
      );

      expect(result.current.shouldShowCrossPhaseJourney()).toBe(false);
    });

    it("should return false with no phases", () => {
      const { result } = renderHook(() =>
        useJourneyHelpers({
          journeys: mockJourneys,
          allPhases: undefined,
          currentPhase: mockPhase1,
          phaseIndex: 0,
        })
      );

      expect(result.current.shouldShowCrossPhaseJourney()).toBe(false);
    });
  });

  describe("shouldShowStartJourney", () => {
    it("should return true for first phase (index 0)", () => {
      const { result } = renderHook(() =>
        useJourneyHelpers({
          journeys: mockJourneys,
          allPhases: [mockPhase1, mockPhase2],
          currentPhase: mockPhase1,
          phaseIndex: 0,
        })
      );

      expect(result.current.shouldShowStartJourney()).toBe(true);
    });

    it("should return true for no-phase section (index -1)", () => {
      const { result } = renderHook(() =>
        useJourneyHelpers({
          journeys: mockJourneys,
          allPhases: [mockPhase1, mockPhase2],
          currentPhase: mockPhase1,
          phaseIndex: -1,
        })
      );

      expect(result.current.shouldShowStartJourney()).toBe(true);
    });

    it("should return false for middle phases", () => {
      const { result } = renderHook(() =>
        useJourneyHelpers({
          journeys: mockJourneys,
          allPhases: [mockPhase1, mockPhase2],
          currentPhase: mockPhase2,
          phaseIndex: 1,
        })
      );

      expect(result.current.shouldShowStartJourney()).toBe(false);
    });

    it("should return false if no locations in phase", () => {
      const emptyPhase = { ...mockPhase1, locations: [] };
      const { result } = renderHook(() =>
        useJourneyHelpers({
          journeys: mockJourneys,
          allPhases: [mockPhase1, mockPhase2],
          currentPhase: emptyPhase,
          phaseIndex: 0,
        })
      );

      expect(result.current.shouldShowStartJourney()).toBe(false);
    });
  });

  describe("shouldShowEndJourney", () => {
    it("should return true for last phase", () => {
      const { result } = renderHook(() =>
        useJourneyHelpers({
          journeys: mockJourneys,
          allPhases: [mockPhase1, mockPhase2],
          currentPhase: mockPhase2,
          phaseIndex: 1,
        })
      );

      expect(result.current.shouldShowEndJourney()).toBe(true);
    });

    it("should return true for no-phase section (index -1)", () => {
      const { result } = renderHook(() =>
        useJourneyHelpers({
          journeys: mockJourneys,
          allPhases: [mockPhase1, mockPhase2],
          currentPhase: mockPhase2,
          phaseIndex: -1,
        })
      );

      expect(result.current.shouldShowEndJourney()).toBe(true);
    });

    it("should return false for first phase", () => {
      const { result } = renderHook(() =>
        useJourneyHelpers({
          journeys: mockJourneys,
          allPhases: [mockPhase1, mockPhase2],
          currentPhase: mockPhase1,
          phaseIndex: 0,
        })
      );

      expect(result.current.shouldShowEndJourney()).toBe(false);
    });

    it("should return false if no locations in phase", () => {
      const emptyPhase = { ...mockPhase2, locations: [] };
      const { result } = renderHook(() =>
        useJourneyHelpers({
          journeys: mockJourneys,
          allPhases: [mockPhase1, emptyPhase],
          currentPhase: emptyPhase,
          phaseIndex: 1,
        })
      );

      expect(result.current.shouldShowEndJourney()).toBe(false);
    });
  });

  describe("memoization", () => {
    it("should memoize results when dependencies don't change", () => {
      const props = {
        journeys: mockJourneys,
        allPhases: [mockPhase1, mockPhase2],
        currentPhase: mockPhase1,
        phaseIndex: 0,
      };

      const { result, rerender } = renderHook((props) => useJourneyHelpers(props), {
        initialProps: props,
      });

      const firstResult = result.current;

      // Rerender with same props
      rerender(props);

      // Should be the same object reference (memoized)
      expect(result.current).toBe(firstResult);
    });

    it("should update when dependencies change", () => {
      const initialProps = {
        journeys: mockJourneys,
        allPhases: [mockPhase1, mockPhase2],
        currentPhase: mockPhase1,
        phaseIndex: 0,
      };

      const { result, rerender } = renderHook((props) => useJourneyHelpers(props), {
        initialProps: initialProps,
      });

      const firstResult = result.current;

      // Rerender with different phase index
      rerender({
        ...initialProps,
        phaseIndex: 1,
      });

      // Should be a new object (not memoized)
      expect(result.current).not.toBe(firstResult);
    });
  });
});
