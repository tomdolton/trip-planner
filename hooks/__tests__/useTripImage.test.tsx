import { renderHook, waitFor } from "@testing-library/react";

import { Trip } from "@/types/trip";

import { useTripImage } from "../useTripImage";

// Mock fetch globally
global.fetch = jest.fn();

describe("useTripImage", () => {
  const mockTrip: Trip = {
    id: "trip-123",
    title: "Paris Adventure",
    description: "A wonderful trip to Paris",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should initialize with loading state", () => {
    const { result } = renderHook(() => useTripImage(mockTrip));

    expect(result.current.imageData).toBeNull();
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("should handle trip without title", async () => {
    const tripWithoutTitle = { ...mockTrip, title: "" };
    const { result } = renderHook(() => useTripImage(tripWithoutTitle));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.imageData).toBeNull();
    expect(result.current.error).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("should use cached image when hash matches", async () => {
    // Generate the correct hash for "Paris Adventure-A wonderful trip to Paris"
    const expectedHash = Buffer.from("Paris Adventure-A wonderful trip to Paris")
      .toString("base64")
      .slice(0, 20);

    const cachedTrip: Trip = {
      ...mockTrip,
      image_search_hash: expectedHash,
      unsplash_image_url: "https://images.unsplash.com/photo-123?w=800",
      unsplash_image_id: "photo-123",
      unsplash_photographer_name: "John Photographer",
      unsplash_photographer_url: "https://unsplash.com/@john",
      unsplash_alt_description: "Beautiful Paris view",
    };

    const { result } = renderHook(() => useTripImage(cachedTrip));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.imageData).toEqual({
      imageUrl: "https://images.unsplash.com/photo-123?w=800",
      downloadUrl: "",
      photographerName: "John Photographer",
      photographerUrl: "https://unsplash.com/@john",
      unsplashUrl: "https://unsplash.com/photos/photo-123",
      altDescription: "Beautiful Paris view",
    });

    expect(fetch).not.toHaveBeenCalled();
  });

  it("should fetch new image when no cached image exists", async () => {
    const mockImageResponse = {
      imageUrl: "https://images.unsplash.com/photo-456?w=800",
      downloadUrl: "https://unsplash.com/photos/photo-456/download",
      photographerName: "Jane Photographer",
      photographerUrl: "https://unsplash.com/@jane",
      unsplashUrl: "https://unsplash.com/photos/photo-456",
      altDescription: "Amazing Paris landscape",
    };

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockImageResponse),
    });

    const { result } = renderHook(() => useTripImage(mockTrip));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.imageData).toEqual(mockImageResponse);
    expect(result.current.error).toBeNull();

    expect(fetch).toHaveBeenCalledWith(
      "/api/trip-image?title=Paris+Adventure&tripId=trip-123&description=A+wonderful+trip+to+Paris"
    );
  });

  it("should fetch new image when hash doesn't match", async () => {
    const outdatedTrip: Trip = {
      ...mockTrip,
      title: "Updated Paris Adventure", // Changed title
      image_search_hash: "old-hash", // Old hash that won't match
      unsplash_image_url: "https://images.unsplash.com/old-photo",
    };

    const mockImageResponse = {
      imageUrl: "https://images.unsplash.com/photo-new?w=800",
      downloadUrl: "https://unsplash.com/photos/photo-new/download",
      photographerName: "New Photographer",
      photographerUrl: "https://unsplash.com/@new",
      unsplashUrl: "https://unsplash.com/photos/photo-new",
      altDescription: "New Paris view",
    };

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockImageResponse),
    });

    const { result } = renderHook(() => useTripImage(outdatedTrip));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.imageData).toEqual(mockImageResponse);
    expect(fetch).toHaveBeenCalled();
  });

  it("should handle fetch error", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useTripImage(mockTrip));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.imageData).toBeNull();
    expect(result.current.error).toBe("Failed to fetch image");
  });

  it("should handle network error", async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useTripImage(mockTrip));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.imageData).toBeNull();
    expect(result.current.error).toBe("Network error");
  });

  it("should handle unknown error", async () => {
    (fetch as jest.Mock).mockRejectedValue("Unknown error");

    const { result } = renderHook(() => useTripImage(mockTrip));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.imageData).toBeNull();
    expect(result.current.error).toBe("Unknown error");
  });

  it("should handle empty response", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    });

    const { result } = renderHook(() => useTripImage(mockTrip));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.imageData).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("should handle trip without description", async () => {
    const tripWithoutDescription = { ...mockTrip, description: undefined };

    const mockImageResponse = {
      imageUrl: "https://images.unsplash.com/photo-789?w=800",
      downloadUrl: "https://unsplash.com/photos/photo-789/download",
      photographerName: "Test Photographer",
      photographerUrl: "https://unsplash.com/@test",
      unsplashUrl: "https://unsplash.com/photos/photo-789",
      altDescription: "Test image",
    };

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockImageResponse),
    });

    const { result } = renderHook(() => useTripImage(tripWithoutDescription));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetch).toHaveBeenCalledWith("/api/trip-image?title=Paris+Adventure&tripId=trip-123");
  });

  it("should refetch when trip properties change", async () => {
    const mockImageResponse1 = {
      imageUrl: "https://images.unsplash.com/photo-1?w=800",
      downloadUrl: "https://unsplash.com/photos/photo-1/download",
      photographerName: "Photographer 1",
      photographerUrl: "https://unsplash.com/@photographer1",
      unsplashUrl: "https://unsplash.com/photos/photo-1",
      altDescription: "Image 1",
    };

    const mockImageResponse2 = {
      imageUrl: "https://images.unsplash.com/photo-2?w=800",
      downloadUrl: "https://unsplash.com/photos/photo-2/download",
      photographerName: "Photographer 2",
      photographerUrl: "https://unsplash.com/@photographer2",
      unsplashUrl: "https://unsplash.com/photos/photo-2",
      altDescription: "Image 2",
    };

    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockImageResponse1),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockImageResponse2),
      });

    const { result, rerender } = renderHook((trip) => useTripImage(trip), {
      initialProps: mockTrip,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.imageData).toEqual(mockImageResponse1);

    // Update trip title
    const updatedTrip = { ...mockTrip, title: "New Paris Adventure" };
    rerender(updatedTrip);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.imageData).toEqual(mockImageResponse2);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("should use default alt description when not provided", async () => {
    // Generate the correct hash for the trip
    const expectedHash = Buffer.from("Paris Adventure-A wonderful trip to Paris")
      .toString("base64")
      .slice(0, 20);

    const cachedTrip: Trip = {
      ...mockTrip,
      image_search_hash: expectedHash,
      unsplash_image_url: "https://images.unsplash.com/photo-123?w=800",
      unsplash_image_id: "photo-123",
      unsplash_photographer_name: "John Photographer",
      unsplash_photographer_url: "https://unsplash.com/@john",
      // No alt description provided
    };

    const { result } = renderHook(() => useTripImage(cachedTrip));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.imageData?.altDescription).toBe("Paris Adventure trip");
  });
});
