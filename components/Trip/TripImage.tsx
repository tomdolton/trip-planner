"use client";

import Image from "next/image";

import { useTripImage } from "@/hooks/useTripImage";

interface TripImageProps {
  title: string;
  description?: string;
  className?: string;
}

export function TripImage({ title, description, className }: TripImageProps) {
  const { imageUrl, loading, error } = useTripImage(title, description);

  if (loading) {
    return (
      <div
        className={`bg-muted rounded-lg flex items-center justify-center animate-pulse ${className}`}
      >
        <span className="text-muted-foreground text-sm">Loading...</span>
      </div>
    );
  }

  if (error || !imageUrl) {
    return (
      <div className={`relative ${className}`}>
        <Image
          src="/images/trip-placeholder.jpg"
          alt="Trip placeholder"
          fill
          sizes="100vw"
          className="object-cover"
          placeholder="empty"
          style={{ objectFit: "cover" }}
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Image
        src={imageUrl}
        alt={`${title} trip`}
        className="w-full h-full object-cover"
        fill
        sizes="100vw"
        onError={() => {}}
        placeholder="empty"
        style={{ objectFit: "cover" }}
      />
    </div>
  );
}
