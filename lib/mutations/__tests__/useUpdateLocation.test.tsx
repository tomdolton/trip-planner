/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";

import { supabase } from "@/lib/supabase";

import { useUpdateLocation } from "../useUpdateLocation";

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

describe("useUpdateLocation", () => {
  const tripId = "test-trip-id";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update location successfully", async () => {
    const mockUpdatedLocation = {
      id: "location-1",
      name: "Updated Location",
      region: "Updated Region",
      notes: "Updated notes",
      trip_phase_id: "phase-1",
    };

    const mockUpdate = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockReturnThis();
    const mockSelect = jest.fn().mockReturnThis();
    const mockSingle = jest.fn().mockResolvedValue({ data: mockUpdatedLocation, error: null });

    mockSupabase.from.mockReturnValue({
      update: mockUpdate,
    } as any);

    mockUpdate.mockReturnValue({
      eq: mockEq,
    } as any);

    mockEq.mockReturnValue({
      select: mockSelect,
    } as any);

    mockSelect.mockReturnValue({
      single: mockSingle,
    } as any);

    const { result } = renderHook(() => useUpdateLocation(tripId), {
      wrapper: createWrapper(),
    });

    const updateData = {
      id: "location-1",
      name: "Updated Location",
      region: "Updated Region",
      notes: "Updated notes",
      phaseId: "phase-1",
    };

    result.current.mutate(updateData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockSupabase.from).toHaveBeenCalledWith("locations");
    expect(mockUpdate).toHaveBeenCalledWith({
      name: "Updated Location",
      region: "Updated Region",
      notes: "Updated notes",
      trip_phase_id: "phase-1",
    });
    expect(mockEq).toHaveBeenCalledWith("id", "location-1");
    expect(result.current.data).toEqual(mockUpdatedLocation);
  });

  it("should handle null/undefined optional fields", async () => {
    const mockUpdatedLocation = {
      id: "location-1",
      name: "Simple Location",
      region: null,
      notes: null,
      trip_phase_id: null,
    };

    const mockUpdate = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockReturnThis();
    const mockSelect = jest.fn().mockReturnThis();
    const mockSingle = jest.fn().mockResolvedValue({ data: mockUpdatedLocation, error: null });

    mockSupabase.from.mockReturnValue({
      update: mockUpdate,
    } as any);

    mockUpdate.mockReturnValue({
      eq: mockEq,
    } as any);

    mockEq.mockReturnValue({
      select: mockSelect,
    } as any);

    mockSelect.mockReturnValue({
      single: mockSingle,
    } as any);

    const { result } = renderHook(() => useUpdateLocation(tripId), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      id: "location-1",
      name: "Simple Location",
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockUpdate).toHaveBeenCalledWith({
      name: "Simple Location",
      region: null,
      notes: null,
      trip_phase_id: null,
    });
  });

  it("should handle error correctly", async () => {
    const errorMessage = "Update failed";
    const mockUpdate = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockReturnThis();
    const mockSelect = jest.fn().mockReturnThis();
    const mockSingle = jest
      .fn()
      .mockResolvedValue({ data: null, error: { message: errorMessage } });

    mockSupabase.from.mockReturnValue({
      update: mockUpdate,
    } as any);

    mockUpdate.mockReturnValue({
      eq: mockEq,
    } as any);

    mockEq.mockReturnValue({
      select: mockSelect,
    } as any);

    mockSelect.mockReturnValue({
      single: mockSingle,
    } as any);

    const { result } = renderHook(() => useUpdateLocation(tripId), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      id: "location-1",
      name: "Test Location",
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeTruthy();
    expect((result.current.error as Error).message).toBe(errorMessage);
  });

  it("should invalidate trip queries on settlement", async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
        mutations: { retry: false },
      },
    });
    const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

    const mockUpdate = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockReturnThis();
    const mockSelect = jest.fn().mockReturnThis();
    const mockSingle = jest.fn().mockResolvedValue({
      data: { id: "location-1", name: "Test" },
      error: null,
    });

    mockSupabase.from.mockReturnValue({
      update: mockUpdate,
    } as any);

    mockUpdate.mockReturnValue({
      eq: mockEq,
    } as any);

    mockEq.mockReturnValue({
      select: mockSelect,
    } as any);

    mockSelect.mockReturnValue({
      single: mockSingle,
    } as any);

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useUpdateLocation(tripId), {
      wrapper: Wrapper,
    });

    result.current.mutate({
      id: "location-1",
      name: "Test Location",
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["trip", tripId],
    });
  });
});
