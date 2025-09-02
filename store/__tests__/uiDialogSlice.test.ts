import type { Activity, Accommodation, Location, Journey, TripPhase } from "@/types/trip";

import reducer, { openDialog, closeDialog, EntityType } from "../uiDialogSlice";

describe("uiDialogSlice", () => {
  const initialState = {
    open: false,
    type: null,
    entity: null,
  };

  // Mock entities for testing
  const mockLocation: Location = {
    id: "location-1",
    trip_id: "trip-123",
    name: "Paris",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  };

  const mockActivity: Activity = {
    id: "activity-1",
    trip_id: "trip-123",
    location_id: "location-1",
    user_id: "user-123",
    name: "Visit Eiffel Tower",
    date: "2024-02-01",
    activity_type: "sightseeing",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  };

  const mockAccommodation: Accommodation = {
    id: "accommodation-1",
    location_id: "location-1",
    trip_id: "trip-123",
    name: "Hotel Paris",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  };

  const mockJourney: Journey = {
    id: "journey-1",
    trip_id: "trip-123",
    departure_location_id: "location-1",
    arrival_location_id: "location-2",
    mode: "train",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  };

  const mockTripPhase: TripPhase = {
    id: "phase-1",
    trip_id: "trip-123",
    title: "Phase 1",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  };

  describe("initial state", () => {
    it("should return the initial state", () => {
      expect(reducer(undefined, { type: "@@INIT" })).toEqual(initialState);
    });

    it("should have correct initial values", () => {
      const state = reducer(undefined, { type: "@@INIT" });
      expect(state.open).toBe(false);
      expect(state.type).toBeNull();
      expect(state.entity).toBeNull();
    });
  });

  describe("openDialog action", () => {
    it("should open dialog with location entity", () => {
      const action = openDialog({
        type: "location",
        entity: mockLocation,
      });

      const state = reducer(initialState, action);

      expect(state).toEqual({
        open: true,
        type: "location",
        entity: mockLocation,
      });
    });

    it("should open dialog with activity entity", () => {
      const action = openDialog({
        type: "activity",
        entity: mockActivity,
      });

      const state = reducer(initialState, action);

      expect(state).toEqual({
        open: true,
        type: "activity",
        entity: mockActivity,
      });
    });

    it("should open dialog with accommodation entity", () => {
      const action = openDialog({
        type: "accommodation",
        entity: mockAccommodation,
      });

      const state = reducer(initialState, action);

      expect(state).toEqual({
        open: true,
        type: "accommodation",
        entity: mockAccommodation,
      });
    });

    it("should open dialog with journey entity", () => {
      const action = openDialog({
        type: "journey",
        entity: mockJourney,
      });

      const state = reducer(initialState, action);

      expect(state).toEqual({
        open: true,
        type: "journey",
        entity: mockJourney,
      });
    });

    it("should open dialog with trip_phase entity", () => {
      const action = openDialog({
        type: "trip_phase",
        entity: mockTripPhase,
      });

      const state = reducer(initialState, action);

      expect(state).toEqual({
        open: true,
        type: "trip_phase",
        entity: mockTripPhase,
      });
    });

    it("should open dialog with null entity", () => {
      const action = openDialog({
        type: "location",
        entity: null,
      });

      const state = reducer(initialState, action);

      expect(state).toEqual({
        open: true,
        type: "location",
        entity: null,
      });
    });

    it("should replace previous dialog state when opening new dialog", () => {
      const previousState = {
        open: true,
        type: "activity" as const,
        entity: mockActivity as EntityType,
      };

      const action = openDialog({
        type: "location",
        entity: mockLocation,
      });

      const state = reducer(previousState, action);

      expect(state).toEqual({
        open: true,
        type: "location",
        entity: mockLocation,
      });
    });

    it("should handle opening dialog with null type", () => {
      const action = openDialog({
        type: null,
        entity: mockLocation,
      });

      const state = reducer(initialState, action);

      expect(state).toEqual({
        open: true,
        type: null,
        entity: mockLocation,
      });
    });
  });

  describe("closeDialog action", () => {
    it("should close dialog and reset state", () => {
      const openState = {
        open: true,
        type: "location" as const,
        entity: mockLocation as EntityType,
      };

      const action = closeDialog();
      const state = reducer(openState, action);

      expect(state).toEqual({
        open: false,
        type: null,
        entity: null,
      });
    });

    it("should work when dialog is already closed", () => {
      const action = closeDialog();
      const state = reducer(initialState, action);

      expect(state).toEqual(initialState);
    });

    it("should reset all properties to initial values", () => {
      const openState = {
        open: true,
        type: "trip_phase" as const,
        entity: mockTripPhase as EntityType,
      };

      const action = closeDialog();
      const state = reducer(openState, action);

      expect(state.open).toBe(false);
      expect(state.type).toBeNull();
      expect(state.entity).toBeNull();
    });
  });

  describe("action creators", () => {
    it("should create openDialog action with correct structure", () => {
      const payload = {
        type: "location" as const,
        entity: mockLocation,
      };

      const action = openDialog(payload);

      expect(action).toEqual({
        type: "uiDialog/openDialog",
        payload,
      });
    });

    it("should create closeDialog action with correct structure", () => {
      const action = closeDialog();

      expect(action).toEqual({
        type: "uiDialog/closeDialog",
      });
    });
  });

  describe("state immutability", () => {
    it("should not mutate the original state when opening dialog", () => {
      const originalState = { ...initialState };
      const action = openDialog({
        type: "location",
        entity: mockLocation,
      });

      reducer(initialState, action);

      expect(initialState).toEqual(originalState);
    });

    it("should not mutate the original state when closing dialog", () => {
      const openState = {
        open: true,
        type: "location" as const,
        entity: mockLocation as EntityType,
      };
      const originalState = { ...openState };
      const action = closeDialog();

      reducer(openState, action);

      expect(openState).toEqual(originalState);
    });

    it("should return a new state object", () => {
      const action = openDialog({
        type: "location",
        entity: mockLocation,
      });

      const newState = reducer(initialState, action);

      expect(newState).not.toBe(initialState);
    });
  });

  describe("type safety", () => {
    it("should accept all valid dialog types", () => {
      const validTypes = [
        "location",
        "accommodation",
        "activity",
        "journey",
        "trip_phase",
        null,
      ] as const;

      validTypes.forEach((type) => {
        const action = openDialog({
          type,
          entity: null,
        });

        expect(action.payload.type).toBe(type);
      });
    });

    it("should handle different entity types correctly", () => {
      const entities = [
        mockLocation,
        mockActivity,
        mockAccommodation,
        mockJourney,
        mockTripPhase,
        null,
      ];

      entities.forEach((entity) => {
        const action = openDialog({
          type: "location",
          entity,
        });

        const state = reducer(initialState, action);
        expect(state.entity).toBe(entity);
      });
    });
  });

  describe("reducer edge cases", () => {
    it("should handle undefined action gracefully", () => {
      // This shouldn't happen in practice, but Redux reducers should be defensive
      const state = reducer(initialState, { type: "UNKNOWN_ACTION" });
      expect(state).toEqual(initialState);
    });

    it("should maintain state shape consistency", () => {
      const openAction = openDialog({
        type: "activity",
        entity: mockActivity,
      });

      let state = reducer(initialState, openAction);

      expect(state).toHaveProperty("open");
      expect(state).toHaveProperty("type");
      expect(state).toHaveProperty("entity");

      const closeAction = closeDialog();
      state = reducer(state, closeAction);

      expect(state).toHaveProperty("open");
      expect(state).toHaveProperty("type");
      expect(state).toHaveProperty("entity");
    });
  });
});
