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

import { useUpdateTrip } from "../useUpdateTrip";

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe("useUpdateTrip", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update trip successfully", async () => {
    const tripData = {
      id: "trip-123",
      title: "Updated Trip Name",
      description: "Updated description",
    };

    // Mock successful update
    const mockUpdate = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockResolvedValue({ error: null });

    mockSupabase.from.mockReturnValue({
      update: mockUpdate,
    } as any);

    mockUpdate.mockReturnValue({
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

    const { result } = renderHook(() => useUpdateTrip(), {
      wrapper: Wrapper,
    });

    // Execute mutation
    result.current.mutate(tripData);

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Verify the mutation completed successfully
    expect(result.current.error).toBeNull();
    expect(mockSupabase.from).toHaveBeenCalledWith("trips");
    expect(mockUpdate).toHaveBeenCalledWith({
      title: "Updated Trip Name",
      description: "Updated description",
    });
    expect(mockEq).toHaveBeenCalledWith("id", "trip-123");
  });

  it("should handle error correctly", async () => {
    const tripData = {
      id: "trip-123",
      title: "Updated Trip Name",
    };

    // Mock failed update
    const mockError = { message: "Update failed" };
    const mockUpdate = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockResolvedValue({ error: mockError });

    mockSupabase.from.mockReturnValue({
      update: mockUpdate,
    } as any);

    mockUpdate.mockReturnValue({
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

    const { result } = renderHook(() => useUpdateTrip(), {
      wrapper: Wrapper,
    });

    // Execute mutation
    result.current.mutate(tripData);

    // Wait for mutation to error
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // Verify error handling
    expect(result.current.error).toEqual(new Error("Update failed"));
    expect(mockSupabase.from).toHaveBeenCalledWith("trips");
    expect(mockUpdate).toHaveBeenCalledWith({ title: "Updated Trip Name" });
    expect(mockEq).toHaveBeenCalledWith("id", "trip-123");
  });

  it("should cancel ongoing queries", async () => {
    const tripData = {
      id: "trip-123",
      title: "Updated Trip Name",
    };

    // Mock successful update
    const mockUpdate = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockResolvedValue({ error: null });

    mockSupabase.from.mockReturnValue({
      update: mockUpdate,
    } as any);

    mockUpdate.mockReturnValue({
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

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useUpdateTrip(), {
      wrapper: Wrapper,
    });

    // Execute mutation
    result.current.mutate(tripData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(cancelQueriesSpy).toHaveBeenCalledWith({ queryKey: ["trips"] });

    cancelQueriesSpy.mockRestore();
  });

  it("should invalidate queries after mutation settles", async () => {
    const tripData = {
      id: "trip-123",
      title: "Updated Trip Name",
    };

    // Mock successful update
    const mockUpdate = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockResolvedValue({ error: null });

    mockSupabase.from.mockReturnValue({
      update: mockUpdate,
    } as any);

    mockUpdate.mockReturnValue({
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

    const { result } = renderHook(() => useUpdateTrip(), {
      wrapper: Wrapper,
    });

    // Execute mutation
    result.current.mutate(tripData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ["trips"] });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ["trip", "trip-123"] });

    invalidateQueriesSpy.mockRestore();
  });

  it("should handle update with optional fields", async () => {
    const tripData = {
      id: "trip-123",
      title: "Updated Trip Name",
      description: "New description",
      start_date: "2024-01-01",
      end_date: "2024-01-07",
    };

    // Mock successful update
    const mockUpdate = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockResolvedValue({ error: null });

    mockSupabase.from.mockReturnValue({
      update: mockUpdate,
    } as any);

    mockUpdate.mockReturnValue({
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

    const { result } = renderHook(() => useUpdateTrip(), {
      wrapper: Wrapper,
    });

    // Execute mutation
    result.current.mutate(tripData);

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Verify the update was called with correct data (excluding id)
    expect(mockUpdate).toHaveBeenCalledWith({
      title: "Updated Trip Name",
      description: "New description",
      start_date: "2024-01-01",
      end_date: "2024-01-07",
    });
    expect(mockEq).toHaveBeenCalledWith("id", "trip-123");
  });

  it("should handle minimal update data", async () => {
    const tripData = {
      id: "trip-456",
      title: "Just Title Update",
    };

    // Mock successful update
    const mockUpdate = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockResolvedValue({ error: null });

    mockSupabase.from.mockReturnValue({
      update: mockUpdate,
    } as any);

    mockUpdate.mockReturnValue({
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

    const { result } = renderHook(() => useUpdateTrip(), {
      wrapper: Wrapper,
    });

    // Execute mutation
    result.current.mutate(tripData);

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Verify the update was called with just the title
    expect(mockUpdate).toHaveBeenCalledWith({
      title: "Just Title Update",
    });
    expect(mockEq).toHaveBeenCalledWith("id", "trip-456");
  });
});
