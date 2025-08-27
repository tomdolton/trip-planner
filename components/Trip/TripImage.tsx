"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

import { Trip } from "@/types/trip";

import { useTripImage } from "@/hooks/useTripImage";

interface TripImageProps {
  trip: Trip;
  className?: string;
  showAttribution?: boolean;
  hasBackgroundLink?: boolean;
}

export function TripImage({
  trip,
  className,
  showAttribution = true,
  hasBackgroundLink = true,
}: TripImageProps) {
  const { imageData, loading, error } = useTripImage(trip);

  // Track download when image is displayed (only for new images)
  useEffect(() => {
    if (imageData?.downloadUrl) {
      const trackDownload = async () => {
        try {
          await fetch("/api/track-download", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              downloadUrl: imageData.downloadUrl,
            }),
          });
        } catch (error) {
          console.error("Failed to track download:", error);
        }
      };

      trackDownload();
    }
  }, [imageData?.downloadUrl]);

  if (loading) {
    return (
      <div
        className={`bg-muted flex animate-pulse items-center justify-center rounded-lg ${className}`}
      >
        <span className="text-muted-foreground text-sm">Loading...</span>
      </div>
    );
  }

  if (error || !imageData) {
    return (
      <div className={`relative ${className}`}>
        <Image
          src="/images/trip-placeholder.jpg"
          alt="Trip placeholder"
          fill
          sizes="(max-width: 640px) 64px, (max-width: 1024px) 128px, 160px"
          className="object-cover"
          placeholder="empty"
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main Image */}
      {hasBackgroundLink ? (
        <Link href={imageData.unsplashUrl} target="_blank" rel="noopener noreferrer">
          <Image
            src={imageData.imageUrl}
            alt={imageData.altDescription}
            fill
            sizes="(max-width: 640px) 64px, (max-width: 1024px) 128px, 160px"
            className="object-cover transition-opacity hover:opacity-95"
            placeholder="empty"
          />
        </Link>
      ) : (
        <Image
          src={imageData.imageUrl}
          alt={imageData.altDescription}
          fill
          sizes="(max-width: 640px) 64px, (max-width: 1024px) 128px, 160px"
          className="object-cover transition-opacity hover:opacity-95"
          placeholder="empty"
        />
      )}

      {/* Attribution Overlay */}
      {showAttribution && imageData.photographerName && (
        <div className="absolute right-0 bottom-0 left-0 bg-black/50 px-3 py-1 text-xs text-white transition">
          <div className="flex items-center justify-between">
            <span>
              Photo by{" "}
              <Link
                href={imageData.photographerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:opacity-80"
              >
                {imageData.photographerName}
              </Link>{" "}
              on{" "}
              <Link
                href="https://unsplash.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:opacity-80"
              >
                Unsplash
              </Link>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
