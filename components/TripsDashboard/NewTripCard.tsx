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
      className={`relative flex flex-col p-6 cursor-pointer ${className}`}
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
        <div className="h-40 w-full lg:h-58 rounded-xl overflow-hidden mb-8 bg-secondary-hover flex items-end justify-center">
          <Image src="/images/new-trip-card.png" alt="" width={320} height={128} priority />
        </div>

        <h2 className="text-card-foreground text-xl font-semibold mb-2">Create a new trip</h2>

        <p className="text-muted-foreground mb-4">Start creating the itinerary for your new trip</p>
      </div>

      <Button
        className="w-full mt-auto bg-primary-hover"
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
