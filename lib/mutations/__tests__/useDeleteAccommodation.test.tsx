import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";

// Mock the API function before importing
jest.mock("@/lib/api/deleteAccommodation", () => ({
  deleteAccommodation: jest.fn(),
}));

import { deleteAccommodation } from "@/lib/api/deleteAccommodation";

import { useDeleteAccommodation } from "../useDeleteAccommodation";

const mockDeleteAccommodation = deleteAccommodation as jest.MockedFunction<
  typeof deleteAccommodation
>;

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

describe("useDeleteAccommodation", () => {
  const tripId = "test-trip-id";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should delete accommodation successfully", async () => {
    mockDeleteAccommodation.mockResolvedValue(true);

    const { result } = renderHook(() => useDeleteAccommodation(tripId), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ id: "accommodation-1" });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockDeleteAccommodation).toHaveBeenCalledWith({ id: "accommodation-1" });
    expect(result.current.data).toBe(true);
  });

  it("should handle error correctly", async () => {
    const errorMessage = "Failed to delete accommodation";
    mockDeleteAccommodation.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useDeleteAccommodation(tripId), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ id: "accommodation-1" });

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

    mockDeleteAccommodation.mockResolvedValue(true);

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useDeleteAccommodation(tripId), {
      wrapper: Wrapper,
    });

    result.current.mutate({ id: "accommodation-1" });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["trip", tripId],
    });
  });
});
