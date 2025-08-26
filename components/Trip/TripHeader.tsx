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
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_352px] gap-4 md:gap-6">
        {/* Left Card - Trip Details */}
        <Card>
          <CardContent className="p-4 pb-8 md:pb-4 @container">
            <div className="flex flex-col md:flex-row items-center gap-4 @lg:gap-10">
              <div className="relative aspect-[16/9] max-w-[360px] w-full flex-shrink-0">
                <TripImage
                  trip={trip}
                  className="rounded-xl overflow-hidden aspect-[16/9] max-w-[360px]"
                  flex-shrink-0
                  showAttribution={true}
                />
              </div>

              {/* Trip Details */}
              <div className="flex-1 order-2 md:order-1">
                <h1 className="text-xl lg:text-2xl font-semibold text-accent-foreground mb-3">
                  {trip.title}
                </h1>

                <p className="text-muted-foreground font-semibold mb-4 md:mb-6">
                  {formatDateRange(trip.start_date, trip.end_date)}
                </p>

                {trip.description && (
                  <div>
                    <p className="whitespace-pre-line text-sm lg:text-base">{trip.description}</p>
                  </div>
                )}
              </div>

              <ActionMenu className="ms-auto md:ms-0 md:mb-auto order-1 md:order-2">
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
          <CardContent className="p-6 flex flex-col items-center md:items-start gap-3 h-full">
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
                Start your trip
              </h2>
            </div>

            <p className="text-sm text-center md:text-left text-muted-foreground">
              Break your trip into phases, or start by adding locations first.
            </p>

            {/* Create New Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="mt-4 md:mt-auto md:ml-auto flex items-center gap-2 px-4 py-2 text-white bg-primary hover:bg-primary/90 rounded-lg min-w-40">
                  <Plus className="size-4" />
                  Create New
                  <ChevronDown className="size-4" />
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
