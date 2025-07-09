"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { getTripById } from "@/lib/api/getTripById";
import { format, parseISO } from "date-fns";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import EditTripForm from "@/components/EditTripForm";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAddTripPhase } from "@/lib/mutations/useAddTripPhase";
import { useQuery } from "@tanstack/react-query";
import { useAddLocation } from "@/lib/mutations/useAddLocation";
import { TripActivities } from "@/components/TripActivities";
import { AddActivityForm } from "@/components/AddActivityForm";

export default function TripDetailPage() {
  const { id } = useParams();
  const [editing, setEditing] = useState(false);

  const [newPhaseTitle, setNewPhaseTitle] = useState("");
  const [isAddingPhase, setIsAddingPhase] = useState(false);
  const { mutate: addPhase, isPending } = useAddTripPhase(id as string);

  const [newLocationTitle, setNewLocationTitle] = useState<Record<string, string>>({});
  const { mutate: addLocation } = useAddLocation(id as string);

  const {
    data: trip,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["trip", id],
    queryFn: () => getTripById(id as string),
    enabled: !!id, // make sure the query doesn't run until we have the ID
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <Skeleton className="h-10 w-1/3 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-2" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (isError) {
    return <p className="text-center text-red-500">Trip not found.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-6">
      <Link
        href="/trips"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:underline"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to trips
      </Link>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{trip?.title}</h1>
        <Button variant="outline" onClick={() => setEditing(true)}>
          Edit
        </Button>
      </div>

      <p className="text-muted-foreground">
        {trip?.start_date && trip.end_date
          ? `${format(parseISO(trip.start_date), "dd MMM yyyy")} - ${format(parseISO(trip.end_date), "dd MMM yyyy")}`
          : "No dates specified"}
      </p>

      {trip?.description && (
        <div>
          <h2 className="text-lg font-semibold mb-1">Description</h2>
          <p className="whitespace-pre-line">{trip.description}</p>
        </div>
      )}

      <div className="mt-8">
        {!isAddingPhase && (
          <Button onClick={() => setIsAddingPhase(true)} size="sm">
            + Add Phase
          </Button>
        )}

        {isAddingPhase && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newPhaseTitle.trim()) return;
              addPhase(newPhaseTitle, {
                onSuccess: () => {
                  setNewPhaseTitle("");
                  setIsAddingPhase(false);
                },
              });
            }}
            className="mt-4 flex items-center gap-2"
          >
            <Input
              value={newPhaseTitle}
              onChange={(e) => setNewPhaseTitle(e.target.value)}
              placeholder="Enter phase title"
              disabled={isPending}
              className="w-full max-w-xs"
            />
            <Button type="submit" size="sm" disabled={isPending}>
              Save
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsAddingPhase(false);
                setNewPhaseTitle("");
              }}
            >
              Cancel
            </Button>
          </form>
        )}
      </div>

      {trip?.trip_phases?.map((phase) => (
        <div
          key={phase.id}
          className="mt-6 bg-slate-200/30 dark:bg-gray-800/30 rounded-lg p-4 border border-slate-300/30 dark:border-slate-700/30"
        >
          <h2 className="text-xl font-bold">{phase.title}</h2>
          {phase.description && <p className="text-muted-foreground">{phase.description}</p>}

          {phase.locations?.map((loc) => (
            <div key={loc.id} className="mt-4 pl-4 border-l">
              <h3 className="text-lg font-semibold">{loc.name}</h3>
              <AddActivityForm tripId={trip.id} locationId={loc.id} />
              {loc.accommodations?.map((acc) => (
                <p key={acc.id} className="text-sm text-muted-foreground">
                  🏨 {acc.name}
                </p>
              ))}
            </div>
          ))}
          <TripActivities
            activities={phase.locations?.flatMap((loc) => loc.activities || []) ?? []}
          />

          <div className="mt-4 flex gap-2 items-center">
            <input
              type="text"
              className="border px-2 py-1 rounded text-sm"
              placeholder="New location name"
              value={newLocationTitle[phase.id] || ""}
              onChange={(e) =>
                setNewLocationTitle((prev) => ({ ...prev, [phase.id]: e.target.value }))
              }
            />
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                if (!newLocationTitle[phase.id]) return;
                addLocation({ phaseId: phase.id, name: newLocationTitle[phase.id] });
                setNewLocationTitle((prev) => ({ ...prev, [phase.id]: "" }));
              }}
            >
              + Add Location
            </Button>
          </div>
        </div>
      ))}

      {Array.isArray(trip?.journeys) && trip.journeys.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <h2 className="text-xl font-bold">Journeys</h2>
          {trip.journeys.map((j) => (
            <p key={j.id} className="text-sm text-muted-foreground">
              ✈️ {j.mode} from {j.departure_location_id} to {j.arrival_location_id}
            </p>
          ))}
        </div>
      )}

      {trip && (
        <Dialog open={editing} onOpenChange={(open) => setEditing(open)}>
          <DialogContent>
            <EditTripForm trip={trip} onClose={() => setEditing(false)} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
