"use client";

import { Info } from "lucide-react";
import { useState } from "react";

import { Trip } from "@/types/trip";

import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { AddLocationDialog } from "./AddLocationDialog";
import { AddTripPhaseDialog } from "./AddTripPhaseDialog";
import { CreateNewDropdown } from "./CreateNewDropdown";

interface TripFooterProps {
  trip: Trip;
}

export function TripFooter({ trip }: TripFooterProps) {
  const [showAddPhaseDialog, setShowAddPhaseDialog] = useState(false);
  const [showAddLocationDialog, setShowAddLocationDialog] = useState(false);

  return (
    <>
      <Card>
        <CardContent className="@container flex flex-col items-center gap-5 p-5 md:flex-row md:items-start md:gap-3">
          <div className="md:space-y-3">
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild className="hidden md:block">
                    <Info className="text-muted-foreground h-4 w-4 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Phases let you organise and make sense of longer or multi-focus trips</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <h2 className="text-accent-foreground text-lg font-semibold lg:text-xl">
                Continue your trip
              </h2>
            </div>

            <p className="text-muted-foreground hidden text-sm md:block">
              Add the next part of your journey - start a new phase or location.
            </p>
          </div>

          <CreateNewDropdown
            onAddPhase={() => setShowAddPhaseDialog(true)}
            onAddLocation={() => setShowAddLocationDialog(true)}
            className="mt-auto ml-auto"
          />
        </CardContent>
      </Card>

      {/* Add Trip Phase Dialog */}
      <AddTripPhaseDialog
        tripId={trip.id}
        open={showAddPhaseDialog}
        onOpenChange={setShowAddPhaseDialog}
      />

      {/* Add Location Dialog with phase selection */}
      <AddLocationDialog
        tripId={trip.id}
        phases={trip.trip_phases || []}
        open={showAddLocationDialog}
        onOpenChange={setShowAddLocationDialog}
      />
    </>
  );
}
