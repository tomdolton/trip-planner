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

import { useDeleteTrip } from "../useDeleteTrip";

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe("useDeleteTrip", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should delete trip successfully", async () => {
    const tripId = "trip-123";

    // Mock successful delete
    const mockDelete = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockResolvedValue({ error: null });

    mockSupabase.from.mockReturnValue({
      delete: mockDelete,
    } as any);

    mockDelete.mockReturnValue({
      eq: mockEq,
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

    const { result } = renderHook(() => useDeleteTrip(), {
      wrapper: Wrapper,
    });

    // Execute mutation
    result.current.mutate(tripId);

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Verify the mutation completed successfully
    expect(result.current.error).toBeNull();
    expect(mockSupabase.from).toHaveBeenCalledWith("trips");
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith("id", tripId);
  });

  it("should handle error correctly", async () => {
    const tripId = "trip-123";

    // Mock failed delete
    const mockError = { message: "Delete failed" };
    const mockDelete = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockResolvedValue({ error: mockError });

    mockSupabase.from.mockReturnValue({
      delete: mockDelete,
    } as any);

    mockDelete.mockReturnValue({
      eq: mockEq,
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

    const { result } = renderHook(() => useDeleteTrip(), {
      wrapper: Wrapper,
    });

    // Trigger the mutation
    result.current.mutate(tripId);

    // Wait for the mutation to error
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // Check error handling
    expect(result.current.error).toEqual(new Error("Delete failed"));
    expect(mockSupabase.from).toHaveBeenCalledWith("trips");
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith("id", tripId);
  });

  it("should handle case when no trips exist", async () => {
    const tripId = "trip-123";

    // Mock successful delete
    const mockDelete = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockResolvedValue({ error: null });

    mockSupabase.from.mockReturnValue({
      delete: mockDelete,
    } as any);

    mockDelete.mockReturnValue({
      eq: mockEq,
    } as any);

    // Create query client with no initial data
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
        mutations: { retry: false },
      },
    });

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useDeleteTrip(), {
      wrapper: Wrapper,
    });

    // Trigger the mutation
    result.current.mutate(tripId);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockSupabase.from).toHaveBeenCalledWith("trips");
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith("id", tripId);
  });

  it("should cancel ongoing queries", async () => {
    const tripId = "trip-123";
    const existingTrips = [
      { id: "trip-123", title: "Trip to Delete" },
      { id: "trip-456", title: "Other Trip" },
    ];

    // Mock successful delete
    const mockDelete = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockResolvedValue({ error: null });

    mockSupabase.from.mockReturnValue({
      delete: mockDelete,
    } as any);

    mockDelete.mockReturnValue({
      eq: mockEq,
    } as any);

    // Create query client with spy
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
        mutations: { retry: false },
      },
    });

    const cancelQueriesSpy = jest.spyOn(queryClient, "cancelQueries");
    queryClient.setQueryData(["trips"], existingTrips);

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useDeleteTrip(), {
      wrapper: Wrapper,
    });

    // Trigger the mutation
    result.current.mutate(tripId);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(cancelQueriesSpy).toHaveBeenCalledWith({ queryKey: ["trips"] });

    cancelQueriesSpy.mockRestore();
  });

  it("should invalidate queries after mutation settles", async () => {
    const tripId = "trip-123";

    // Mock successful delete
    const mockDelete = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockResolvedValue({ error: null });

    mockSupabase.from.mockReturnValue({
      delete: mockDelete,
    } as any);

    mockDelete.mockReturnValue({
      eq: mockEq,
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

    const { result } = renderHook(() => useDeleteTrip(), {
      wrapper: Wrapper,
    });

    // Trigger the mutation
    result.current.mutate(tripId);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ["trips"] });

    invalidateQueriesSpy.mockRestore();
  });

  it("should handle trip that doesn't exist", async () => {
    const tripId = "non-existent-trip";
    const existingTrips = [
      { id: "trip-123", title: "Existing Trip" },
      { id: "trip-456", title: "Another Trip" },
    ];

    // Mock successful delete
    const mockDelete = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockResolvedValue({ error: null });

    mockSupabase.from.mockReturnValue({
      delete: mockDelete,
    } as any);

    mockDelete.mockReturnValue({
      eq: mockEq,
    } as any);

    // Create query client with initial data
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
        mutations: { retry: false },
      },
    });

    queryClient.setQueryData(["trips"], existingTrips);

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useDeleteTrip(), {
      wrapper: Wrapper,
    });

    // Trigger the mutation
    result.current.mutate(tripId);

    // Data should remain unchanged since trip doesn't exist
    expect(queryClient.getQueryData(["trips"])).toEqual(existingTrips);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockSupabase.from).toHaveBeenCalledWith("trips");
  });
});
