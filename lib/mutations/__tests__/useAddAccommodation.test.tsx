import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";

// Mock the API function before importing
jest.mock("@/lib/api/addAccommodation", () => ({
  addAccommodation: jest.fn(),
}));

import { addAccommodation } from "@/lib/api/addAccommodation";

import { useAddAccommodation } from "../useAddAccommodation";

const mockAddAccommodation = addAccommodation as jest.MockedFunction<typeof addAccommodation>;

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

describe("useAddAccommodation", () => {
  const tripId = "test-trip-id";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should add accommodation successfully", async () => {
    const mockAccommodation = {
      id: "accommodation-1",
      name: "Test Hotel",
      location_id: "location-1",
      trip_id: tripId,
      check_in: "2024-01-01",
      check_out: "2024-01-03",
      notes: "Nice place",
      url: "https://example.com",
      place_id: "place-123",
    };

    mockAddAccommodation.mockResolvedValue(mockAccommodation);

    const { result } = renderHook(() => useAddAccommodation(tripId), {
      wrapper: createWrapper(),
    });

    const accommodationData = {
      locationId: "location-1",
      name: "Test Hotel",
      check_in: "2024-01-01",
      check_out: "2024-01-03",
      notes: "Nice place",
      url: "https://example.com",
      place_id: "place-123",
    };

    result.current.mutate(accommodationData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockAddAccommodation).toHaveBeenCalledWith({
      ...accommodationData,
      tripId,
    });
    expect(result.current.data).toEqual(mockAccommodation);
  });

  it("should handle accommodation with minimal data", async () => {
    const mockAccommodation = {
      id: "accommodation-2",
      name: "Simple Hotel",
      location_id: "location-2",
      trip_id: tripId,
    };

    mockAddAccommodation.mockResolvedValue(mockAccommodation);

    const { result } = renderHook(() => useAddAccommodation(tripId), {
      wrapper: createWrapper(),
    });

    const minimalData = {
      locationId: "location-2",
      name: "Simple Hotel",
    };

    result.current.mutate(minimalData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockAddAccommodation).toHaveBeenCalledWith({
      ...minimalData,
      tripId,
    });
  });

  it("should handle error correctly", async () => {
    const errorMessage = "Failed to add accommodation";
    mockAddAccommodation.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useAddAccommodation(tripId), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      locationId: "location-1",
      name: "Test Hotel",
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

    const mockAccommodation = {
      id: "accommodation-1",
      name: "Test Hotel",
      location_id: "location-1",
      trip_id: tripId,
    };

    mockAddAccommodation.mockResolvedValue(mockAccommodation);

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useAddAccommodation(tripId), {
      wrapper: Wrapper,
    });

    result.current.mutate({
      locationId: "location-1",
      name: "Test Hotel",
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["trip", tripId],
    });
  });

  it("should handle accommodation with all optional fields", async () => {
    const mockAccommodation = {
      id: "accommodation-1",
      name: "Luxury Hotel",
      location_id: "location-1",
      trip_id: tripId,
      check_in: "2024-02-01T15:00:00Z",
      check_out: "2024-02-05T11:00:00Z",
      notes: "Spa and pool available",
      url: "https://luxury-hotel.com",
      place_id: "ChIJplace123",
    };

    mockAddAccommodation.mockResolvedValue(mockAccommodation);

    const { result } = renderHook(() => useAddAccommodation(tripId), {
      wrapper: createWrapper(),
    });

    const fullData = {
      locationId: "location-1",
      name: "Luxury Hotel",
      check_in: "2024-02-01T15:00:00Z",
      check_out: "2024-02-05T11:00:00Z",
      notes: "Spa and pool available",
      url: "https://luxury-hotel.com",
      place_id: "ChIJplace123",
    };

    result.current.mutate(fullData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockAddAccommodation).toHaveBeenCalledWith({
      ...fullData,
      tripId,
    });
    expect(result.current.data).toEqual(mockAccommodation);
  });

  it("should not invalidate queries on error", async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
        mutations: { retry: false },
      },
    });
    const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

    mockAddAccommodation.mockRejectedValue(new Error("API Error"));

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useAddAccommodation(tripId), {
      wrapper: Wrapper,
    });

    result.current.mutate({
      locationId: "location-1",
      name: "Test Hotel",
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(invalidateQueriesSpy).not.toHaveBeenCalled();
  });
});
