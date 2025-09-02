/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";

// Mock dependencies first before importing
jest.mock("@/hooks/useUser", () => ({
  useUser: jest.fn(),
}));
jest.mock("@/lib/api/addActivity", () => ({
  addActivity: jest.fn(),
}));

import { addActivity } from "@/lib/api/addActivity";

import { useUser } from "@/hooks/useUser";

import { useAddActivity } from "../useAddActivity";

const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;
const mockAddActivity = addActivity as jest.MockedFunction<typeof addActivity>;

describe("useAddActivity", () => {
  const tripId = "trip-123";
  const mockUser = {
    id: "user-123",
    email: "test@example.com",
    app_metadata: {},
    user_metadata: {},
    aud: "authenticated",
    created_at: "2023-01-01T00:00:00Z",
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should add activity successfully", async () => {
    const activityData = {
      locationId: "location-123",
      name: "Test Activity",
      date: "2024-01-15",
      start_time: "09:00",
      end_time: "12:00",
      notes: "Test notes",
      placeId: "place-123",
      activity_type: "sightseeing" as const,
    };

    const expectedReturnData = {
      id: "activity-123",
      trip_id: tripId,
      location_id: "location-123",
      name: "Test Activity",
      date: "2024-01-15",
      start_time: "09:00:00",
      end_time: "12:00:00",
      notes: "Test notes",
      place_id: "place-123",
      activity_type: "sightseeing",
      user_id: "user-123",
    };

    // Mock authenticated user
    mockUseUser.mockReturnValue({
      user: mockUser,
      loading: false,
    });

    // Mock successful activity addition
    mockAddActivity.mockResolvedValue(expectedReturnData);

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

    const { result } = renderHook(() => useAddActivity(tripId), {
      wrapper: Wrapper,
    });

    // Execute mutation
    result.current.mutate(activityData);

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Verify the mutation completed successfully
    expect(result.current.error).toBeNull();
    expect(result.current.data).toEqual(expectedReturnData);
    expect(mockAddActivity).toHaveBeenCalledWith({
      ...activityData,
      tripId,
      userId: "user-123",
    });
  });

  it("should handle unauthenticated user error", async () => {
    const activityData = {
      locationId: "location-123",
      name: "Test Activity",
      date: "2024-01-15",
      activity_type: "sightseeing" as const,
    };

    // Mock unauthenticated user
    mockUseUser.mockReturnValue({
      user: null,
      loading: false,
    });

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

    const { result } = renderHook(() => useAddActivity(tripId), {
      wrapper: Wrapper,
    });

    // Execute mutation
    result.current.mutate(activityData);

    // Wait for mutation to error
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // Verify error handling
    expect(result.current.error).toEqual(new Error("User ID is required to add an activity."));
    expect(mockAddActivity).not.toHaveBeenCalled();
  });

  it("should handle API error correctly", async () => {
    const activityData = {
      locationId: "location-123",
      name: "Test Activity",
      date: "2024-01-15",
      activity_type: "food" as const,
    };

    // Mock authenticated user
    mockUseUser.mockReturnValue({
      user: mockUser,
      loading: false,
    });

    // Mock API error
    mockAddActivity.mockRejectedValue(new Error("API error"));

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

    const { result } = renderHook(() => useAddActivity(tripId), {
      wrapper: Wrapper,
    });

    // Execute mutation
    result.current.mutate(activityData);

    // Wait for mutation to error
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // Verify error handling
    expect(result.current.error).toEqual(new Error("API error"));
    expect(mockAddActivity).toHaveBeenCalledWith({
      ...activityData,
      tripId,
      userId: "user-123",
    });
  });

  it("should invalidate queries after successful mutation", async () => {
    const activityData = {
      locationId: "location-456",
      name: "Museum Visit",
      date: "2024-02-20",
      activity_type: "museum" as const,
    };

    // Mock authenticated user
    mockUseUser.mockReturnValue({
      user: mockUser,
      loading: false,
    });

    // Mock successful activity addition
    mockAddActivity.mockResolvedValue({
      id: "activity-456",
      ...activityData,
    });

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

    const { result } = renderHook(() => useAddActivity(tripId), {
      wrapper: Wrapper,
    });

    // Execute mutation
    result.current.mutate(activityData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ["trip", tripId] });

    invalidateQueriesSpy.mockRestore();
  });

  it("should handle activity with minimal data", async () => {
    const activityData = {
      locationId: "location-789",
      name: "Simple Activity",
      date: "2024-03-10",
      activity_type: "other" as const,
    };

    // Mock authenticated user
    mockUseUser.mockReturnValue({
      user: mockUser,
      loading: false,
    });

    // Mock successful activity addition
    mockAddActivity.mockResolvedValue({
      id: "activity-789",
      ...activityData,
      trip_id: tripId,
      user_id: "user-123",
    });

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

    const { result } = renderHook(() => useAddActivity(tripId), {
      wrapper: Wrapper,
    });

    // Execute mutation
    result.current.mutate(activityData);

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Verify the mutation handled minimal data correctly
    expect(mockAddActivity).toHaveBeenCalledWith({
      ...activityData,
      tripId,
      userId: "user-123",
    });
  });

  it("should handle activity with all optional fields", async () => {
    const activityData = {
      locationId: "location-full",
      name: "Complete Activity",
      date: "2024-04-05",
      start_time: "14:30",
      end_time: "17:00",
      notes: "Complete activity with all fields",
      placeId: "google-place-123",
      activity_type: "adventure_sports" as const,
    };

    // Mock authenticated user
    mockUseUser.mockReturnValue({
      user: mockUser,
      loading: false,
    });

    // Mock successful activity addition
    mockAddActivity.mockResolvedValue({
      id: "activity-full",
      ...activityData,
      trip_id: tripId,
      user_id: "user-123",
    });

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

    const { result } = renderHook(() => useAddActivity(tripId), {
      wrapper: Wrapper,
    });

    // Execute mutation
    result.current.mutate(activityData);

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Verify all fields were passed correctly
    expect(mockAddActivity).toHaveBeenCalledWith({
      locationId: "location-full",
      name: "Complete Activity",
      date: "2024-04-05",
      start_time: "14:30",
      end_time: "17:00",
      notes: "Complete activity with all fields",
      placeId: "google-place-123",
      activity_type: "adventure_sports",
      tripId,
      userId: "user-123",
    });
  });
});
