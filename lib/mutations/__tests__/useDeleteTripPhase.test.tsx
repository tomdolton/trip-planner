/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";

import { supabase } from "@/lib/supabase";

import { useDeleteTripPhase } from "../useDeleteTripPhase";

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

describe("useDeleteTripPhase", () => {
  const tripId = "test-trip-id";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should delete trip phase successfully", async () => {
    const mockDelete = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockResolvedValue({ error: null });

    mockSupabase.from.mockReturnValue({
      delete: mockDelete,
    } as any);

    mockDelete.mockReturnValue({
      eq: mockEq,
    } as any);

    const { result } = renderHook(() => useDeleteTripPhase(tripId), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ id: "phase-1" });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockSupabase.from).toHaveBeenCalledWith("trip_phases");
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith("id", "phase-1");
  });

  it("should handle error correctly", async () => {
    const errorMessage = "Delete failed";
    const mockDelete = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockResolvedValue({ error: { message: errorMessage } });

    mockSupabase.from.mockReturnValue({
      delete: mockDelete,
    } as any);

    mockDelete.mockReturnValue({
      eq: mockEq,
    } as any);

    const { result } = renderHook(() => useDeleteTripPhase(tripId), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ id: "phase-1" });

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

    const mockDelete = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockResolvedValue({ error: null });

    mockSupabase.from.mockReturnValue({
      delete: mockDelete,
    } as any);

    mockDelete.mockReturnValue({
      eq: mockEq,
    } as any);

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useDeleteTripPhase(tripId), {
      wrapper: Wrapper,
    });

    result.current.mutate({ id: "phase-1" });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["trip", tripId],
    });
  });
});
