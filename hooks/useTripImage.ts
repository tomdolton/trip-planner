import { useState, useEffect } from "react";

import { Trip } from "@/types/trip";

interface UnsplashImageData {
  imageUrl: string;
  downloadUrl: string;
  photographerName: string;
  photographerUrl: string;
  unsplashUrl: string;
  altDescription: string;
}

function getSearchHash(title: string, description?: string): string {
  return Buffer.from(`${title}-${description || ""}`)
    .toString("base64")
    .slice(0, 20);
}

export function useTripImage(trip: Trip) {
  const [imageData, setImageData] = useState<UnsplashImageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      if (!trip.title) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const currentHash = getSearchHash(trip.title, trip.description);

        // Only fetch if we haven't searched this exact content before
        if (trip.image_search_hash === currentHash && trip.unsplash_image_url) {
          setImageData({
            imageUrl: trip.unsplash_image_url,
            downloadUrl: "", // No download tracking for cached images
            photographerName: trip.unsplash_photographer_name || "",
            photographerUrl: trip.unsplash_photographer_url || "",
            unsplashUrl: `https://unsplash.com/photos/${trip.unsplash_image_id || ""}`,
            altDescription: trip.unsplash_alt_description || `${trip.title} trip`,
          });
          setLoading(false);
          return;
        }

        // Fetch new image and update database
        const params = new URLSearchParams({
          title: trip.title,
          tripId: trip.id,
          ...(trip.description && { description: trip.description }),
        });

        const response = await fetch(`/api/trip-image?${params}`);

        if (!response.ok) {
          throw new Error("Failed to fetch image");
        }

        const data = await response.json();

        if (data.imageUrl) {
          setImageData({
            imageUrl: data.imageUrl,
            downloadUrl: data.downloadUrl,
            photographerName: data.photographerName,
            photographerUrl: data.photographerUrl,
            unsplashUrl: data.unsplashUrl,
            altDescription: data.altDescription,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [
    trip.title,
    trip.description,
    trip.id,
    trip.image_search_hash,
    trip.unsplash_image_url,
    trip.unsplash_alt_description,
    trip.unsplash_image_id,
    trip.unsplash_photographer_name,
    trip.unsplash_photographer_url,
  ]);

  return { imageData, loading, error };
}
