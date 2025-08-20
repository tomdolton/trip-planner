"use client";

import TripsList from "@/components/TripsDashboard/TripsList";

export default function TripsPage() {
  return (
    <div className="container 2xl:max-w-[96rem] py-8">
      <div className="flex justify-between items-center">
        <div className="space-y-6 mb-14">
          <h1 className="text-4xl md:text-5xl font-bold">Trips</h1>
          <p className="text-muted-foreground text-lg font-medium">Plan and manage your trips</p>
        </div>

        <div>PLACEHOLDER</div>
      </div>

      <TripsList />
    </div>
  );
}
