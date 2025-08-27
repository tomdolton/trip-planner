"use client";

import { useState } from "react";

import { TripsFilterTabs, TripsFilter } from "@/components/TripsDashboard/TripsFilterTabs";
import TripsList from "@/components/TripsDashboard/TripsList";

export default function TripsPage() {
  const [filter, setFilter] = useState<TripsFilter>("upcoming");
  return (
    <div className="container py-8 2xl:max-w-[96rem]">
      <div className="flex items-center justify-between">
        <div className="mb-14 space-y-6">
          <h1 className="text-4xl font-bold md:text-5xl">Trips</h1>
          <p className="text-muted-foreground text-lg font-medium">Plan and manage your trips</p>
        </div>

        <TripsFilterTabs value={filter} onChange={setFilter} />
      </div>

      <TripsList filter={filter} />
    </div>
  );
}
