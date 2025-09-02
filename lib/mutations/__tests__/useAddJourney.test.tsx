/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";

// Mock dependencies before importing
jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn(),
  },
}));
jest.mock("@/lib/utils/dateTime", () => ({
  normaliseTime: jest.fn(),
}));

import { supabase } from "@/lib/supabase";
import { normaliseTime } from "@/lib/utils/dateTime";

import { useAddJourney } from "../useAddJourney";

const mockSupabase = supabase as jest.Mocked<typeof supabase>;
const mockNormaliseTime = normaliseTime as jest.MockedFunction<typeof normaliseTime>;

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

describe("useAddJourney", () => {
  const tripId = "test-trip-id";

  beforeEach(() => {
    jest.clearAllMocks();
    mockNormaliseTime.mockImplementation((value?: string) => (value ? `${value}:00` : null));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should add journey successfully", async () => {
    const mockJourney = {
      id: "journey-1",
      trip_id: tripId,
      mode: "flight",
      departure_time: "2024-01-01T10:00:00Z",
      arrival_time: "2024-01-01T14:00:00Z",
      notes: "Direct flight",
      provider: "Airline XYZ",
      departure_location_id: null,
      arrival_location_id: null,
    };

    const mockInsert = jest.fn().mockReturnThis();
    const mockSelect = jest.fn().mockReturnThis();
    const mockSingle = jest.fn().mockResolvedValue({ data: mockJourney, error: null });

    mockSupabase.from.mockReturnValue({
      insert: mockInsert,
      select: mockSelect,
      single: mockSingle,
    } as any);

    mockInsert.mockReturnValue({
      select: mockSelect,
    } as any);

    mockSelect.mockReturnValue({
      single: mockSingle,
    } as any);

    const { result } = renderHook(() => useAddJourney(tripId), {
      wrapper: createWrapper(),
    });

    const journeyData = {
      trip_id: tripId,
      departure_location_id: null,
      arrival_location_id: null,
      mode: "flight",
      departure_time: "2024-01-01T10:00:00Z",
      arrival_time: "2024-01-01T14:00:00Z",
      notes: "Direct flight",
      provider: "Airline XYZ",
    };

    result.current.mutate(journeyData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockSupabase.from).toHaveBeenCalledWith("journeys");
    expect(mockInsert).toHaveBeenCalledWith([
      {
        ...journeyData,
        departure_time: "2024-01-01T10:00:00Z:00",
        arrival_time: "2024-01-01T14:00:00Z:00",
      },
    ]);
    expect(result.current.data).toEqual(mockJourney);
  });

  it("should normalize time fields when provided", async () => {
    const mockJourney = {
      id: "journey-1",
      trip_id: tripId,
      mode: "train",
      departure_time: "10:00:00",
      arrival_time: "14:00:00",
      departure_location_id: null,
      arrival_location_id: null,
    };

    mockNormaliseTime.mockImplementation((value?: string) => (value ? `${value}:00` : null));

    const mockInsert = jest.fn().mockReturnThis();
    const mockSelect = jest.fn().mockReturnThis();
    const mockSingle = jest.fn().mockResolvedValue({ data: mockJourney, error: null });

    mockSupabase.from.mockReturnValue({
      insert: mockInsert,
      select: mockSelect,
      single: mockSingle,
    } as any);

    mockInsert.mockReturnValue({
      select: mockSelect,
    } as any);

    mockSelect.mockReturnValue({
      single: mockSingle,
    } as any);

    const { result } = renderHook(() => useAddJourney(tripId), {
      wrapper: createWrapper(),
    });

    const journeyData = {
      trip_id: tripId,
      departure_location_id: null,
      arrival_location_id: null,
      mode: "train",
      departure_time: "10:00",
      arrival_time: "14:00",
    };

    result.current.mutate(journeyData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockNormaliseTime).toHaveBeenCalledWith("10:00");
    expect(mockNormaliseTime).toHaveBeenCalledWith("14:00");
    expect(mockInsert).toHaveBeenCalledWith([
      {
        trip_id: tripId,
        departure_location_id: null,
        arrival_location_id: null,
        mode: "train",
        departure_time: "10:00:00",
        arrival_time: "14:00:00",
      },
    ]);
  });

  it("should handle journey without time fields", async () => {
    const mockJourney = {
      id: "journey-2",
      trip_id: tripId,
      mode: "car",
      departure_time: null,
      arrival_time: null,
      departure_location_id: "loc-1",
      arrival_location_id: "loc-2",
    };

    const mockInsert = jest.fn().mockReturnThis();
    const mockSelect = jest.fn().mockReturnThis();
    const mockSingle = jest.fn().mockResolvedValue({ data: mockJourney, error: null });

    mockSupabase.from.mockReturnValue({
      insert: mockInsert,
      select: mockSelect,
      single: mockSingle,
    } as any);

    mockInsert.mockReturnValue({
      select: mockSelect,
    } as any);

    mockSelect.mockReturnValue({
      single: mockSingle,
    } as any);

    const { result } = renderHook(() => useAddJourney(tripId), {
      wrapper: createWrapper(),
    });

    const journeyData = {
      trip_id: tripId,
      departure_location_id: "loc-1",
      arrival_location_id: "loc-2",
      mode: "car",
    };

    result.current.mutate(journeyData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockInsert).toHaveBeenCalledWith([
      {
        trip_id: tripId,
        departure_location_id: "loc-1",
        arrival_location_id: "loc-2",
        mode: "car",
        departure_time: null,
        arrival_time: null,
      },
    ]);
  });

  it("should handle error correctly", async () => {
    const errorMessage = "Database error";
    const mockInsert = jest.fn().mockReturnThis();
    const mockSelect = jest.fn().mockReturnThis();
    const mockSingle = jest
      .fn()
      .mockResolvedValue({ data: null, error: { message: errorMessage } });

    mockSupabase.from.mockReturnValue({
      insert: mockInsert,
      select: mockSelect,
      single: mockSingle,
    } as any);

    mockInsert.mockReturnValue({
      select: mockSelect,
    } as any);

    mockSelect.mockReturnValue({
      single: mockSingle,
    } as any);

    const { result } = renderHook(() => useAddJourney(tripId), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      trip_id: tripId,
      departure_location_id: null,
      arrival_location_id: null,
      mode: "flight",
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeTruthy();
    expect((result.current.error as Error).message).toBe(errorMessage);
  });

  it("should invalidate trip queries on success", async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
        mutations: { retry: false },
      },
    });
    const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

    const mockJourney = {
      id: "journey-1",
      trip_id: tripId,
      mode: "bus",
      departure_location_id: null,
      arrival_location_id: null,
    };

    const mockInsert = jest.fn().mockReturnThis();
    const mockSelect = jest.fn().mockReturnThis();
    const mockSingle = jest.fn().mockResolvedValue({ data: mockJourney, error: null });

    mockSupabase.from.mockReturnValue({
      insert: mockInsert,
      select: mockSelect,
      single: mockSingle,
    } as any);

    mockInsert.mockReturnValue({
      select: mockSelect,
    } as any);

    mockSelect.mockReturnValue({
      single: mockSingle,
    } as any);

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useAddJourney(tripId), {
      wrapper: Wrapper,
    });

    result.current.mutate({
      trip_id: tripId,
      departure_location_id: null,
      arrival_location_id: null,
      mode: "bus",
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["trip", tripId],
    });
  });
});
