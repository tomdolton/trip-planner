"use client";

import { ChevronLeft } from "lucide-react";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

import { Trip } from "@/types/trip";

import { ActionMenu, ActionMenuItem, ActionMenuSeparator } from "@/components/ui/ActionMenu";

import { formatDateRange } from "@/lib/utils/formatDateRange";

interface TripHeaderProps {
  trip: Trip;
  onEditClick: () => void;
  onDeleteClick?: () => void; // Add this prop for delete action
}

export function TripHeader({ trip, onEditClick, onDeleteClick }: TripHeaderProps) {
  return (
    <div className="space-y-4">
      <Link
        href="/trips"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:underline"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to trips
      </Link>

      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold">{trip.title}</h1>
          <div style={{ marginLeft: 20 }}>
            <ActionMenu>
              <ActionMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  onEditClick();
                }}
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </ActionMenuItem>
              <ActionMenuSeparator />
              <ActionMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  onDeleteClick?.();
                }}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </ActionMenuItem>
            </ActionMenu>
          </div>
        </div>
      </div>

      <p className="text-muted-foreground">{formatDateRange(trip.start_date, trip.end_date)}</p>

      {trip.description && (
        <div>
          <h2 className="text-lg font-semibold mb-1">Description</h2>
          <p className="whitespace-pre-line">{trip.description}</p>
        </div>
      )}
    </div>
  );
}
