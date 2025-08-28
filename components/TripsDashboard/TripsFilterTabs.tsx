"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type TripsFilter = "upcoming" | "past" | "all";

interface TripsFilterTabsProps {
  value: TripsFilter;
  onChange: (value: TripsFilter) => void;
}

const FILTERS: { label: string; value: TripsFilter }[] = [
  { label: "Upcoming Trips", value: "upcoming" },
  { label: "Past Trips", value: "past" },
  { label: "All Trips", value: "all" },
];

export function TripsFilterTabs({ value, onChange }: TripsFilterTabsProps) {
  return (
    <div className="bg-secondary mx-auto flex w-full max-w-md flex-col gap-2 rounded-xl px-1.5 py-2 sm:me-0 sm:inline-flex sm:w-auto sm:flex-row sm:gap-0">
      {FILTERS.map((filter) => (
        <button
          key={filter.value}
          type="button"
          className={cn(
            // Mobile: full width, stack, gap-2; Desktop: inline-flex, min-w-32
            "w-full min-w-32 cursor-pointer rounded-xl p-3 text-sm transition sm:w-auto",
            value === filter.value
              ? "bg-card text-foreground font-semibold shadow-xs"
              : "text-muted-foreground"
          )}
          aria-pressed={value === filter.value}
          onClick={() => onChange(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
