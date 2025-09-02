"use client";
import { Plus } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { TripItemCard } from "@/components/ui/TripItemCard";

interface NewTripCardProps {
  onClick: () => void;
  className?: string;
}

export default function NewTripCard({ onClick, className }: NewTripCardProps) {
  return (
    <TripItemCard
      className={`relative flex cursor-pointer flex-col p-6 ${className}`}
      hoverEffect
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label="Create a new trip"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
    >
      <div>
        <div className="bg-secondary-hover mb-8 flex h-40 w-full items-end justify-center overflow-hidden rounded-xl lg:h-58">
          <Image src="/images/new-trip-card.png" alt="" width={320} height={128} priority />
        </div>

        <h2 className="text-card-foreground mb-2 text-xl font-semibold">Create a new trip</h2>

        <p className="text-muted-foreground mb-4">Start creating the itinerary for your new trip</p>
      </div>

      <Button
        className="mt-auto w-full"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <Plus className="size-4" />
        Create New Trip
      </Button>
    </TripItemCard>
  );
}
