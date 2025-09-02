import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";

// Mock dependencies first before importing
jest.mock("@/lib/api/deleteLocation", () => ({
  deleteLocation: jest.fn(),
}));

import { deleteLocation } from "@/lib/api/deleteLocation";

import { useDeleteLocation } from "../useDeleteLocation";

const mockDeleteLocation = deleteLocation as jest.MockedFunction<typeof deleteLocation>;

describe("useDeleteLocation", () => {
  const tripId = "trip-123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should delete location successfully", async () => {
    const locationId = "location-123";

    // Mock successful delete
    mockDeleteLocation.mockResolvedValue(true);

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

    const { result } = renderHook(() => useDeleteLocation(tripId), {
      wrapper: Wrapper,
    });

    // Execute mutation
    result.current.mutate({ id: locationId });

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Verify the mutation completed successfully
    expect(result.current.error).toBeNull();
    expect(result.current.data).toBe(true);
    expect(mockDeleteLocation).toHaveBeenCalledWith({ id: locationId });
  });

  it("should handle error correctly", async () => {
    const locationId = "location-123";

    // Mock failed delete
    mockDeleteLocation.mockRejectedValue(new Error("Delete failed"));

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

    const { result } = renderHook(() => useDeleteLocation(tripId), {
      wrapper: Wrapper,
    });

    // Execute mutation
    result.current.mutate({ id: locationId });

    // Wait for mutation to error
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // Verify error handling
    expect(result.current.error).toEqual(new Error("Delete failed"));
    expect(mockDeleteLocation).toHaveBeenCalledWith({ id: locationId });
  });

  it("should invalidate queries after successful mutation", async () => {
    const locationId = "location-456";

    // Mock successful delete
    mockDeleteLocation.mockResolvedValue(true);

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

    const { result } = renderHook(() => useDeleteLocation(tripId), {
      wrapper: Wrapper,
    });

    // Execute mutation
    result.current.mutate({ id: locationId });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ["trip", tripId] });

    invalidateQueriesSpy.mockRestore();
  });

  it("should not invalidate queries on error", async () => {
    const locationId = "location-789";

    // Mock failed delete
    mockDeleteLocation.mockRejectedValue(new Error("Network error"));

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

    const { result } = renderHook(() => useDeleteLocation(tripId), {
      wrapper: Wrapper,
    });

    // Execute mutation
    result.current.mutate({ id: locationId });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // Should not invalidate queries on error (only on success)
    expect(invalidateQueriesSpy).not.toHaveBeenCalled();

    invalidateQueriesSpy.mockRestore();
  });
});
