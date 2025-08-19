"use client";

import { useState } from "react";

import TripForm from "@/components/TripsDashboard/TripForm";
import TripsList from "@/components/TripsDashboard/TripsList";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function TripsPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="container 2xl:max-w-[96rem] py-8">
      <div className="flex justify-between items-center">
        <div className="space-y-6 mb-14">
          <h1 className="text-4xl md:text-5xl font-bold">Trips</h1>
          <p className="text-muted-foreground text-lg font-medium">Plan and manage your trips</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="whitespace-nowrap">+ New Trip</Button>
          </DialogTrigger>
          <DialogContent>
            <TripForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <TripsList />
    </div>
  );
}
