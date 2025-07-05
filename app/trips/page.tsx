'use client';

import { useState } from 'react';
import TripsList from '@/components/TripsList';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import TripForm from '@/components/TripForm';

export default function TripsPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-6 sm:p-10 gap-10 font-[family-name:var(--font-geist-sans)]">
      <div className="flex w-full max-w-6xl justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-serif">Trips</h1>
          <p className="text-muted-foreground">Plan and manage your trips</p>
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
