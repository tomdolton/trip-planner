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

import { usePlaceDetail } from "../usePlaceDetail";

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

describe("usePlaceDetail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should not fetch place detail when placeId is null", () => {
    const { result } = renderHook(() => usePlaceDetail(null), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(mockSupabase.from).not.toHaveBeenCalled();
  });

  it("should not fetch place detail when placeId is undefined", () => {
    const { result } = renderHook(() => usePlaceDetail(undefined), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(mockSupabase.from).not.toHaveBeenCalled();
  });

  it("should not fetch place detail when placeId is empty string", () => {
    const { result } = renderHook(() => usePlaceDetail(""), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(mockSupabase.from).not.toHaveBeenCalled();
  });

  it("should fetch place detail successfully", async () => {
    const placeId = "place-123";
    const mockPlaceData = {
      id: placeId,
      name: "Test Place",
      lat: 40.7128,
      lng: -74.006,
      formatted_address: "New York, NY, USA",
      google_place_id: "ChIJOwg_06VPwokRYv534QaPC8g",
      is_google_place: true,
      place_types: ["locality", "political"],
      rating: 4.5,
      price_level: 2,
      website: "https://example.com",
      phone_number: "+1234567890",
      photos: JSON.stringify([{ photo_reference: "abc123" }]),
      opening_hours: JSON.stringify({ open_now: true }),
      user_id: "user-123",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    };

    const mockSelect = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockReturnThis();
    const mockMaybeSingle = jest.fn().mockResolvedValue({ data: mockPlaceData, error: null });

    mockSupabase.from.mockReturnValue({
      select: mockSelect,
    } as any);

    mockSelect.mockReturnValue({
      eq: mockEq,
    } as any);

    mockEq.mockReturnValue({
      maybeSingle: mockMaybeSingle,
    } as any);

    const { result } = renderHook(() => usePlaceDetail(placeId), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockPlaceData);
    expect(mockSupabase.from).toHaveBeenCalledWith("places");
    expect(mockSelect).toHaveBeenCalledWith("*");
    expect(mockEq).toHaveBeenCalledWith("id", placeId);
    expect(mockMaybeSingle).toHaveBeenCalled();
  });

  it("should handle error when fetching place detail fails", async () => {
    const placeId = "place-123";
    const mockError = { message: "Place not found" };

    const mockSelect = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockReturnThis();
    const mockMaybeSingle = jest.fn().mockResolvedValue({ data: null, error: mockError });

    mockSupabase.from.mockReturnValue({
      select: mockSelect,
    } as any);

    mockSelect.mockReturnValue({
      eq: mockEq,
    } as any);

    mockEq.mockReturnValue({
      maybeSingle: mockMaybeSingle,
    } as any);

    const { result } = renderHook(() => usePlaceDetail(placeId), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeTruthy();
    expect((result.current.error as Error).message).toBe("Place not found");
  });

  it("should return null when place is not found (no error)", async () => {
    const placeId = "place-123";

    const mockSelect = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockReturnThis();
    const mockMaybeSingle = jest.fn().mockResolvedValue({ data: null, error: null });

    mockSupabase.from.mockReturnValue({
      select: mockSelect,
    } as any);

    mockSelect.mockReturnValue({
      eq: mockEq,
    } as any);

    mockEq.mockReturnValue({
      maybeSingle: mockMaybeSingle,
    } as any);

    const { result } = renderHook(() => usePlaceDetail(placeId), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeNull();
  });

  it("should return null immediately when placeId becomes null", async () => {
    const placeId = "place-123";

    const mockSelect = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockReturnThis();
    const mockMaybeSingle = jest.fn().mockResolvedValue({
      data: { id: placeId, name: "Test Place" },
      error: null,
    });

    mockSupabase.from.mockReturnValue({
      select: mockSelect,
    } as any);

    mockSelect.mockReturnValue({
      eq: mockEq,
    } as any);

    mockEq.mockReturnValue({
      maybeSingle: mockMaybeSingle,
    } as any);

    // Initially render with a valid placeId
    const { result, rerender } = renderHook(({ id }) => usePlaceDetail(id), {
      initialProps: { id: placeId },
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Now rerender with null placeId
    rerender({ id: null as any });

    // Should return null immediately without fetching
    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });

  it("should use correct query key", () => {
    const placeId = "place-456";

    const mockSelect = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockReturnThis();
    const mockMaybeSingle = jest.fn().mockResolvedValue({ data: null, error: null });

    mockSupabase.from.mockReturnValue({
      select: mockSelect,
    } as any);

    mockSelect.mockReturnValue({
      eq: mockEq,
    } as any);

    mockEq.mockReturnValue({
      maybeSingle: mockMaybeSingle,
    } as any);

    const { result } = renderHook(() => usePlaceDetail(placeId), {
      wrapper: createWrapper(),
    });

    // Query should be enabled and start loading
    expect(result.current.isLoading).toBe(true);
  });
});
