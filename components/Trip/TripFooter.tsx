"use client";

import { Info, Plus, ChevronDown, FolderPlus, MapPin } from "lucide-react";
import { useState } from "react";

import { Trip } from "@/types/trip";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { AddLocationDialog } from "./AddLocationDialog";
import { AddTripPhaseDialog } from "./AddTripPhaseDialog";

interface TripFooterProps {
  trip: Trip;
}

export function TripFooter({ trip }: TripFooterProps) {
  const [showAddPhaseDialog, setShowAddPhaseDialog] = useState(false);
  const [showAddLocationDialog, setShowAddLocationDialog] = useState(false);

  return (
    <>
      <Card>
        <CardContent className="p-5 flex flex-col md:flex-row items-start gap-3">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Phases let you organise and make sense of longer or multi-focus trips</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <h2 className="text-lg lg:text-xl font-semibold text-accent-foreground">
                Continue your trip
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Add the next part of your journey - start a new phase or location.
            </p>
          </div>

          {/* Create New Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="mt-auto ml-auto flex items-center gap-2 px-4 py-2 text-white bg-primary hover:bg-primary/90 rounded-lg min-w-40">
                <Plus className="w-4 h-4" />
                Create New
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-40">
              <DropdownMenuItem
                className="flex items-center gap-2 py-2 cursor-pointer"
                onSelect={() => setShowAddPhaseDialog(true)}
              >
                <FolderPlus className="w-4 h-4" />
                <span>Phase</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 py-2 cursor-pointer border-t"
                onSelect={() => setShowAddLocationDialog(true)}
              >
                <MapPin className="w-4 h-4" />
                <span>Location</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
