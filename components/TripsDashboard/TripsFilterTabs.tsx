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
    <div className="inline-flex rounded-xl bg-secondary py-2 px-1.5">
      {FILTERS.map((filter) => (
        <button
          key={filter.value}
          type="button"
          className={cn(
            "p-3 text-sm transition rounded-xl cursor-pointer min-w-32",
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
