/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";

// Mock dependencies first before importing
jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn(),
    auth: {
      getUser: jest.fn(),
    },
  },
}));

import { supabase } from "@/lib/supabase";

import { useTripDetail } from "../useTripDetail";

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return Wrapper;
}

describe("useTripDetail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should not fetch trip detail when tripId is empty", () => {
    const { result } = renderHook(() => useTripDetail(""), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(mockSupabase.from).not.toHaveBeenCalled();
  });

  it("should fetch trip detail successfully", async () => {
    const tripId = "trip-123";
    const mockTripData = {
      id: tripId,
      title: "Test Trip",
      user_id: "user-123",
      trip_phases: [
        {
          id: "phase-1",
          title: "Phase 1",
          locations: [
            { id: "loc-1", name: "Location 1" },
            { id: "loc-2", name: "Location 2" },
          ],
        },
      ],
      unassigned_locations: [
        { id: "loc-3", name: "Unassigned Location 1" },
        { id: "loc-1", name: "Location 1" }, // This should be filtered out
      ],
      journeys: [{ id: "journey-1", mode: "flight" }],
    };

    const expectedFilteredData = {
      ...mockTripData,
      unassigned_locations: [{ id: "loc-3", name: "Unassigned Location 1" }],
    };

    const mockSelect = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockReturnThis();
    const mockSingle = jest.fn().mockResolvedValue({ data: mockTripData, error: null });

    mockSupabase.from.mockReturnValue({
      select: mockSelect,
    } as any);

    mockSelect.mockReturnValue({
      eq: mockEq,
    } as any);

    mockEq.mockReturnValue({
      single: mockSingle,
    } as any);

    const { result } = renderHook(() => useTripDetail(tripId), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(expectedFilteredData);
    expect(mockSupabase.from).toHaveBeenCalledWith("trips");
    expect(mockSelect).toHaveBeenCalledWith(expect.stringContaining("trip_phases"));
    expect(mockEq).toHaveBeenCalledWith("id", tripId);
    expect(mockSingle).toHaveBeenCalled();
  });

  it("should handle error when fetching trip detail fails", async () => {
    const tripId = "trip-123";
    const mockError = { message: "Trip not found" };

    const mockSelect = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockReturnThis();
    const mockSingle = jest.fn().mockResolvedValue({ data: null, error: mockError });

    mockSupabase.from.mockReturnValue({
      select: mockSelect,
    } as any);

    mockSelect.mockReturnValue({
      eq: mockEq,
    } as any);

    mockEq.mockReturnValue({
      single: mockSingle,
    } as any);

    // Mock console.error to avoid noise in test output
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    const { result } = renderHook(() => useTripDetail(tripId), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeTruthy();
    expect((result.current.error as Error).message).toBe("Trip not found");
    expect(consoleErrorSpy).toHaveBeenCalledWith("Trip detail query error:", mockError);

    consoleErrorSpy.mockRestore();
  });

  it("should filter out locations from unassigned_locations that are already in phases", async () => {
    const tripId = "trip-123";
    const mockTripData = {
      id: tripId,
      title: "Test Trip",
      trip_phases: [
        {
          id: "phase-1",
          locations: [
            { id: "loc-1", name: "Location 1" },
            { id: "loc-2", name: "Location 2" },
          ],
        },
        {
          id: "phase-2",
          locations: [{ id: "loc-3", name: "Location 3" }],
        },
      ],
      unassigned_locations: [
        { id: "loc-1", name: "Location 1" }, // Should be filtered out
        { id: "loc-2", name: "Location 2" }, // Should be filtered out
        { id: "loc-3", name: "Location 3" }, // Should be filtered out
        { id: "loc-4", name: "Location 4" }, // Should remain
        { id: "loc-5", name: "Location 5" }, // Should remain
      ],
    };

    const mockSelect = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockReturnThis();
    const mockSingle = jest.fn().mockResolvedValue({ data: mockTripData, error: null });

    mockSupabase.from.mockReturnValue({
      select: mockSelect,
    } as any);

    mockSelect.mockReturnValue({
      eq: mockEq,
    } as any);

    mockEq.mockReturnValue({
      single: mockSingle,
    } as any);

    const { result } = renderHook(() => useTripDetail(tripId), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.unassigned_locations).toHaveLength(2);
    expect(result.current.data?.unassigned_locations).toEqual([
      { id: "loc-4", name: "Location 4" },
      { id: "loc-5", name: "Location 5" },
    ]);
  });

  it("should handle trip with no phases gracefully", async () => {
    const tripId = "trip-123";
    const mockTripData = {
      id: tripId,
      title: "Test Trip",
      trip_phases: null,
      unassigned_locations: [
        { id: "loc-1", name: "Location 1" },
        { id: "loc-2", name: "Location 2" },
      ],
      journeys: [],
    };

    const mockSelect = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockReturnThis();
    const mockSingle = jest.fn().mockResolvedValue({ data: mockTripData, error: null });

    mockSupabase.from.mockReturnValue({
      select: mockSelect,
    } as any);

    mockSelect.mockReturnValue({
      eq: mockEq,
    } as any);

    mockEq.mockReturnValue({
      single: mockSingle,
    } as any);

    const { result } = renderHook(() => useTripDetail(tripId), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.unassigned_locations).toHaveLength(2);
    expect(result.current.data?.unassigned_locations).toEqual([
      { id: "loc-1", name: "Location 1" },
      { id: "loc-2", name: "Location 2" },
    ]);
  });

  it("should handle trip with no unassigned locations gracefully", async () => {
    const tripId = "trip-123";
    const mockTripData = {
      id: tripId,
      title: "Test Trip",
      trip_phases: [
        {
          id: "phase-1",
          locations: [{ id: "loc-1", name: "Location 1" }],
        },
      ],
      unassigned_locations: null,
      journeys: [],
    };

    const mockSelect = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockReturnThis();
    const mockSingle = jest.fn().mockResolvedValue({ data: mockTripData, error: null });

    mockSupabase.from.mockReturnValue({
      select: mockSelect,
    } as any);

    mockSelect.mockReturnValue({
      eq: mockEq,
    } as any);

    mockEq.mockReturnValue({
      single: mockSingle,
    } as any);

    const { result } = renderHook(() => useTripDetail(tripId), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.unassigned_locations).toEqual([]);
  });
});
