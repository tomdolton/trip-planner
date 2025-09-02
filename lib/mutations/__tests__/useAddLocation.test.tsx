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

import { useAddLocation } from "../useAddLocation";

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe("useAddLocation", () => {
  const tripId = "trip-123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should add location successfully", async () => {
    const locationData = {
      name: "Test Location",
      region: "Test Region",
      notes: "Test notes",
      phaseId: "phase-123",
      placeId: "place-123",
    };

    const expectedInsertData = {
      trip_id: tripId,
      trip_phase_id: "phase-123",
      place_id: "place-123",
      name: "Test Location",
      region: "Test Region",
      notes: "Test notes",
    };

    const mockReturnData = {
      id: "location-123",
      ...expectedInsertData,
      place: { id: "place-123", name: "Test Place" },
    };

    // Mock successful insert
    const mockInsert = jest.fn().mockReturnThis();
    const mockSelect = jest.fn().mockReturnThis();
    const mockSingle = jest.fn().mockResolvedValue({
      data: mockReturnData,
      error: null,
    });

    mockSupabase.from.mockReturnValue({
      insert: mockInsert,
    } as any);

    mockInsert.mockReturnValue({
      select: mockSelect,
    } as any);

    mockSelect.mockReturnValue({
      single: mockSingle,
    } as any);

    // Create query client
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
        mutations: { retry: false },
      },
    });

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useAddLocation(tripId), {
      wrapper: Wrapper,
    });

    // Execute mutation
    result.current.mutate(locationData);

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Verify the mutation completed successfully
    expect(result.current.error).toBeNull();
    expect(result.current.data).toEqual(mockReturnData);
    expect(mockSupabase.from).toHaveBeenCalledWith("locations");
    expect(mockInsert).toHaveBeenCalledWith([expectedInsertData]);
    expect(mockSelect).toHaveBeenCalledWith(`
          *,
          place:places(*)
        `);
  });

  it("should handle location without phaseId (unassigned)", async () => {
    const locationData = {
      name: "Unassigned Location",
      region: "Test Region",
    };

    const expectedInsertData = {
      trip_id: tripId,
      trip_phase_id: null,
      place_id: null,
      name: "Unassigned Location",
      region: "Test Region",
      notes: null,
    };

    const mockReturnData = {
      id: "location-456",
      ...expectedInsertData,
      place: null,
    };

    // Mock successful insert
    const mockInsert = jest.fn().mockReturnThis();
    const mockSelect = jest.fn().mockReturnThis();
    const mockSingle = jest.fn().mockResolvedValue({
      data: mockReturnData,
      error: null,
    });

    mockSupabase.from.mockReturnValue({
      insert: mockInsert,
    } as any);

    mockInsert.mockReturnValue({
      select: mockSelect,
    } as any);

    mockSelect.mockReturnValue({
      single: mockSingle,
    } as any);

    // Create query client
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
        mutations: { retry: false },
      },
    });

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useAddLocation(tripId), {
      wrapper: Wrapper,
    });

    // Execute mutation
    result.current.mutate(locationData);

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Verify the mutation completed successfully
    expect(result.current.error).toBeNull();
    expect(mockInsert).toHaveBeenCalledWith([expectedInsertData]);
  });

  it("should handle error correctly", async () => {
    const locationData = {
      name: "Test Location",
    };

    // Mock failed insert
    const mockError = { message: "Insert failed" };
    const mockInsert = jest.fn().mockReturnThis();
    const mockSelect = jest.fn().mockReturnThis();
    const mockSingle = jest.fn().mockResolvedValue({
      data: null,
      error: mockError,
    });

    mockSupabase.from.mockReturnValue({
      insert: mockInsert,
    } as any);

    mockInsert.mockReturnValue({
      select: mockSelect,
    } as any);

    mockSelect.mockReturnValue({
      single: mockSingle,
    } as any);

    // Create query client
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
        mutations: { retry: false },
      },
    });

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useAddLocation(tripId), {
      wrapper: Wrapper,
    });

    // Execute mutation
    result.current.mutate(locationData);

    // Wait for mutation to error
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // Verify error handling
    expect(result.current.error).toEqual(new Error("Insert failed"));
  });

  it("should cancel ongoing queries", async () => {
    const locationData = {
      name: "Test Location",
    };

    // Mock successful insert
    const mockInsert = jest.fn().mockReturnThis();
    const mockSelect = jest.fn().mockReturnThis();
    const mockSingle = jest.fn().mockResolvedValue({
      data: { id: "location-123" },
      error: null,
    });

    mockSupabase.from.mockReturnValue({
      insert: mockInsert,
    } as any);

    mockInsert.mockReturnValue({
      select: mockSelect,
    } as any);

    mockSelect.mockReturnValue({
      single: mockSingle,
    } as any);

    // Create query client with spy
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
        mutations: { retry: false },
      },
    });

    const cancelQueriesSpy = jest.spyOn(queryClient, "cancelQueries");

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useAddLocation(tripId), {
      wrapper: Wrapper,
    });

    // Execute mutation
    result.current.mutate(locationData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(cancelQueriesSpy).toHaveBeenCalledWith({ queryKey: ["trip", tripId] });

    cancelQueriesSpy.mockRestore();
  });

  it("should invalidate queries after mutation settles", async () => {
    const locationData = {
      name: "Test Location",
    };

    // Mock successful insert
    const mockInsert = jest.fn().mockReturnThis();
    const mockSelect = jest.fn().mockReturnThis();
    const mockSingle = jest.fn().mockResolvedValue({
      data: { id: "location-123" },
      error: null,
    });

    mockSupabase.from.mockReturnValue({
      insert: mockInsert,
    } as any);

    mockInsert.mockReturnValue({
      select: mockSelect,
    } as any);

    mockSelect.mockReturnValue({
      single: mockSingle,
    } as any);

    // Create query client with spy
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
        mutations: { retry: false },
      },
    });

    const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useAddLocation(tripId), {
      wrapper: Wrapper,
    });

    // Execute mutation
    result.current.mutate(locationData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ["trip", tripId] });

    invalidateQueriesSpy.mockRestore();
  });

  it("should handle minimal location data", async () => {
    const locationData = {
      name: "Minimal Location",
    };

    const expectedInsertData = {
      trip_id: tripId,
      trip_phase_id: null,
      place_id: null,
      name: "Minimal Location",
      region: null,
      notes: null,
    };

    // Mock successful insert
    const mockInsert = jest.fn().mockReturnThis();
    const mockSelect = jest.fn().mockReturnThis();
    const mockSingle = jest.fn().mockResolvedValue({
      data: { id: "location-789", ...expectedInsertData },
      error: null,
    });

    mockSupabase.from.mockReturnValue({
      insert: mockInsert,
    } as any);

    mockInsert.mockReturnValue({
      select: mockSelect,
    } as any);

    mockSelect.mockReturnValue({
      single: mockSingle,
    } as any);

    // Create query client
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
        mutations: { retry: false },
      },
    });

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useAddLocation(tripId), {
      wrapper: Wrapper,
    });

    // Execute mutation
    result.current.mutate(locationData);

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Verify the mutation handled minimal data correctly
    expect(mockInsert).toHaveBeenCalledWith([expectedInsertData]);
  });
});
