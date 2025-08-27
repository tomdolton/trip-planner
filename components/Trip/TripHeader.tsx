"use client";

import { Info, Plus, ChevronDown, FolderPlus, MapPin } from "lucide-react";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import { Trip } from "@/types/trip";

import { ActionMenu, ActionMenuItem, ActionMenuSeparator } from "@/components/ui/ActionMenu";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { formatDateRange } from "@/lib/utils/dateTime";

import { AddLocationDialog } from "./AddLocationDialog";
import { AddTripPhaseDialog } from "./AddTripPhaseDialog";
import { TripImage } from "./TripImage";

interface TripHeaderProps {
  trip: Trip;
  onEditClick: () => void;
  onDeleteClick?: () => void;
}

export function TripHeader({ trip, onEditClick, onDeleteClick }: TripHeaderProps) {
  const [showAddPhaseDialog, setShowAddPhaseDialog] = useState(false);
  const [showAddLocationDialog, setShowAddLocationDialog] = useState(false);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-[1fr_352px]">
        {/* Left Card - Trip Details */}
        <Card>
          <CardContent className="@container p-4 pb-8 md:pb-4">
            <div className="flex flex-col items-center gap-4 md:flex-row @lg:gap-10">
              <div className="relative aspect-[16/9] w-full max-w-[360px] flex-shrink-0">
                <TripImage
                  trip={trip}
                  className="aspect-[16/9] max-w-[360px] overflow-hidden rounded-xl"
                  flex-shrink-0
                  showAttribution={true}
                />
              </div>

              {/* Trip Details */}
              <div className="order-2 flex-1 md:order-1">
                <h1 className="text-accent-foreground mb-3 text-xl font-semibold lg:text-2xl">
                  {trip.title}
                </h1>

                <p className="text-muted-foreground mb-4 font-semibold md:mb-6">
                  {formatDateRange(trip.start_date, trip.end_date)}
                </p>

                {trip.description && (
                  <div>
                    <p className="text-sm whitespace-pre-line lg:text-base">{trip.description}</p>
                  </div>
                )}
              </div>

              <ActionMenu className="order-1 ms-auto md:order-2 md:ms-0 md:mb-auto">
                <ActionMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    onEditClick();
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
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
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </ActionMenuItem>
              </ActionMenu>
            </div>
          </CardContent>
        </Card>

        {/* Right Card - Start Your Trip */}
        <Card>
          <CardContent className="flex h-full flex-col items-center gap-3 p-6 md:items-start">
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="text-muted-foreground h-4 w-4 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Phases let you organise and make sense of longer or multi-focus trips</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <h2 className="text-accent-foreground text-lg font-semibold lg:text-xl">
                Start your trip
              </h2>
            </div>

            <p className="text-muted-foreground text-center text-sm md:text-left">
              Break your trip into phases, or start by adding locations first.
            </p>

            {/* Create New Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 mt-4 flex min-w-40 items-center gap-2 rounded-lg px-4 py-2 text-white md:mt-auto md:ml-auto">
                  <Plus className="size-4" />
                  Create New
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-40">
                <DropdownMenuItem
                  className="flex cursor-pointer items-center gap-2 py-2"
                  onSelect={() => setShowAddPhaseDialog(true)}
                >
                  <FolderPlus className="h-4 w-4" />
                  <span>Phase</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex cursor-pointer items-center gap-2 border-t py-2"
                  onSelect={() => setShowAddLocationDialog(true)}
                >
                  <MapPin className="h-4 w-4" />
                  <span>Location</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>
      </div>

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
    </div>
  );
}
