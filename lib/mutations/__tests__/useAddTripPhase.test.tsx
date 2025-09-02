/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";

import { supabase } from "@/lib/supabase";

import { useAddTripPhase } from "../useAddTripPhase";

// Mock supabase
jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn(),
  },
}));

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

describe("useAddTripPhase", () => {
  const tripId = "test-trip-id";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should add trip phase successfully", async () => {
    const mockPhase = {
      id: "phase-1",
      trip_id: tripId,
      title: "Phase 1",
      description: "First phase",
      start_date: "2024-01-01",
      end_date: "2024-01-05",
    };

    const mockInsert = jest.fn().mockReturnThis();
    const mockSelect = jest.fn().mockReturnThis();
    const mockSingle = jest.fn().mockResolvedValue({ data: mockPhase, error: null });

    mockSupabase.from.mockReturnValue({
      insert: mockInsert,
    } as any);

    mockInsert.mockReturnValue({
      select: mockSelect,
    } as any);

    mockSelect.mockReturnValue({
      single: mockSingle,
    } as any);

    const { result } = renderHook(() => useAddTripPhase(tripId), {
      wrapper: createWrapper(),
    });

    const phaseData = {
      title: "Phase 1",
      description: "First phase",
      start_date: "2024-01-01",
      end_date: "2024-01-05",
    };

    result.current.mutate(phaseData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockSupabase.from).toHaveBeenCalledWith("trip_phases");
    expect(mockInsert).toHaveBeenCalledWith([
      {
        title: "Phase 1",
        description: "First phase",
        start_date: "2024-01-01",
        end_date: "2024-01-05",
        trip_id: tripId,
      },
    ]);
    expect(result.current.data).toEqual(mockPhase);
  });

  it("should handle minimal phase data", async () => {
    const mockPhase = {
      id: "phase-2",
      trip_id: tripId,
      title: "Simple Phase",
      description: null,
      start_date: null,
      end_date: null,
    };

    const mockInsert = jest.fn().mockReturnThis();
    const mockSelect = jest.fn().mockReturnThis();
    const mockSingle = jest.fn().mockResolvedValue({ data: mockPhase, error: null });

    mockSupabase.from.mockReturnValue({
      insert: mockInsert,
    } as any);

    mockInsert.mockReturnValue({
      select: mockSelect,
    } as any);

    mockSelect.mockReturnValue({
      single: mockSingle,
    } as any);

    const { result } = renderHook(() => useAddTripPhase(tripId), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      title: "Simple Phase",
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockInsert).toHaveBeenCalledWith([
      {
        title: "Simple Phase",
        description: null,
        start_date: null,
        end_date: null,
        trip_id: tripId,
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
    } as any);

    mockInsert.mockReturnValue({
      select: mockSelect,
    } as any);

    mockSelect.mockReturnValue({
      single: mockSingle,
    } as any);

    const { result } = renderHook(() => useAddTripPhase(tripId), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      title: "Test Phase",
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeTruthy();
    expect((result.current.error as Error).message).toBe(errorMessage);
  });

  it("should perform optimistic updates", async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
        mutations: { retry: false },
      },
    });

    const mockTrip = {
      id: tripId,
      trip_phases: [{ id: "existing-phase", title: "Existing Phase", locations: [] }],
    };

    queryClient.setQueryData(["trip", tripId], mockTrip);

    const mockPhase = {
      id: "phase-1",
      trip_id: tripId,
      title: "New Phase",
    };

    const mockInsert = jest.fn().mockReturnThis();
    const mockSelect = jest.fn().mockReturnThis();
    const mockSingle = jest.fn().mockResolvedValue({ data: mockPhase, error: null });

    mockSupabase.from.mockReturnValue({
      insert: mockInsert,
    } as any);

    mockInsert.mockReturnValue({
      select: mockSelect,
    } as any);

    mockSelect.mockReturnValue({
      single: mockSingle,
    } as any);

    const cancelQueriesSpy = jest.spyOn(queryClient, "cancelQueries");
    const setQueryDataSpy = jest.spyOn(queryClient, "setQueryData");

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useAddTripPhase(tripId), {
      wrapper: Wrapper,
    });

    result.current.mutate({
      title: "New Phase",
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(cancelQueriesSpy).toHaveBeenCalledWith({ queryKey: ["trip", tripId] });
    expect(setQueryDataSpy).toHaveBeenCalled();
  });

  it("should invalidate queries on settlement", async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
        mutations: { retry: false },
      },
    });
    const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

    const mockPhase = {
      id: "phase-1",
      trip_id: tripId,
      title: "New Phase",
    };

    const mockInsert = jest.fn().mockReturnThis();
    const mockSelect = jest.fn().mockReturnThis();
    const mockSingle = jest.fn().mockResolvedValue({ data: mockPhase, error: null });

    mockSupabase.from.mockReturnValue({
      insert: mockInsert,
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

    const { result } = renderHook(() => useAddTripPhase(tripId), {
      wrapper: Wrapper,
    });

    result.current.mutate({
      title: "New Phase",
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["trip", tripId],
    });
  });

  it("should rollback optimistic update on error", async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
        mutations: { retry: false },
      },
    });

    const originalTrip = {
      id: tripId,
      trip_phases: [{ id: "existing-phase", title: "Existing Phase", locations: [] }],
    };

    queryClient.setQueryData(["trip", tripId], originalTrip);

    const mockInsert = jest.fn().mockReturnThis();
    const mockSelect = jest.fn().mockReturnThis();
    const mockSingle = jest.fn().mockResolvedValue({ data: null, error: { message: "Error" } });

    mockSupabase.from.mockReturnValue({
      insert: mockInsert,
    } as any);

    mockInsert.mockReturnValue({
      select: mockSelect,
    } as any);

    mockSelect.mockReturnValue({
      single: mockSingle,
    } as any);

    const setQueryDataSpy = jest.spyOn(queryClient, "setQueryData");

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useAddTripPhase(tripId), {
      wrapper: Wrapper,
    });

    result.current.mutate({
      title: "New Phase",
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // Should be called twice: once for optimistic update, once for rollback
    expect(setQueryDataSpy).toHaveBeenCalledTimes(2);
  });
});
