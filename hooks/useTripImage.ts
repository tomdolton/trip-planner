import { useState, useEffect } from "react";

export function useTripImage(title: string, description?: string) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      if (!title) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          title,
          ...(description && { description }),
        });

        const response = await fetch(`/api/trip-image?${params}`);

        if (!response.ok) {
          throw new Error("Failed to fetch image");
        }

        const data = await response.json();

        if (data.imageUrl) {
          setImageUrl(data.imageUrl);
        }
        // If no imageUrl in response, imageUrl remains null and TripImage will show fallback
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [title, description]);

  return { imageUrl, loading, error };
}
