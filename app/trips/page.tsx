"use client";

import { useState } from "react";

import { TripsFilterTabs, TripsFilter } from "@/components/TripsDashboard/TripsFilterTabs";
import TripsList from "@/components/TripsDashboard/TripsList";

export default function TripsPage() {
  const [filter, setFilter] = useState<TripsFilter>("upcoming");
  return (
    <div className="container py-6 md:py-7 2xl:max-w-[96rem]">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="space-y-4 text-center sm:mb-14 sm:space-y-6 sm:text-start">
          <h1 className="text-3xl font-bold sm:text-5xl">Trips</h1>
          <p className="text-muted-foreground font-medium sm:text-lg">Plan and manage your trips</p>
        </div>

        <TripsFilterTabs value={filter} onChange={setFilter} />
      </div>

      <TripsList filter={filter} />
    </div>
  );
}
