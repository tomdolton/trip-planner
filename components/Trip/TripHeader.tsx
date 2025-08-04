"use client";

import { ChevronLeft } from "lucide-react";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

import { Trip } from "@/types/trip";

import { ActionMenu, ActionMenuItem, ActionMenuSeparator } from "@/components/ui/ActionMenu";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { formatDateRange } from "@/lib/utils/formatDateRange";

interface TripHeaderProps {
  trip: Trip;
  onEditClick: () => void;
  onDeleteClick?: () => void;
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Card - Trip Details */}
        <Card className="lg:col-span-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-6 lg:gap-10">
              {/* Placeholder Image */}
              <div className="flex-shrink-0 hidden sm:block">
                <div className="w-32 h-32 lg:w-40 lg:h-40 bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">Image</span>
                </div>
              </div>

              {/* Trip Details */}
              <div className="flex-1">
                <h1 className="text-xl lg:text-2xl font-semibold text-accent-foreground mb-3">
                  {trip.title}
                </h1>

                <p className="text-muted-foreground font-semibold mb-6">
                  {formatDateRange(trip.start_date, trip.end_date)}
                </p>

                {trip.description && (
                  <div>
                    <p className="whitespace-pre-line text-sm lg:text-base">{trip.description}</p>
                  </div>
                )}
              </div>

              <ActionMenu className="mb-auto">
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
          </CardContent>
        </Card>

        {/* Right Card - Start Your Trip */}
        <Card>
          <CardContent className="p-6 flex flex-col items-start gap-3 h-full">
            <h2 className="text-lg lg:text-xl font-semibold text-accent-foreground">
              Start your trip
            </h2>
            <p className="text-sm text-muted-foreground">
              Break your trip into phases, or start by adding locations first.
            </p>
            <Button className="mt-auto ms-auto">Create New</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
