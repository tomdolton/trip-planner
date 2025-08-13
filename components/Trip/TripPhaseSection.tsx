"use client";

import { ChevronDown, Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";

import { TripPhase, Journey, Location } from "@/types/trip";

import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { ActionMenu, ActionMenuItem, ActionMenuSeparator } from "@/components/ui/ActionMenu";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "@/components/ui/ConfirmDeleteDialog";

import { useAddJourney } from "@/lib/mutations/useAddJourney";
import { useDeleteTripPhase } from "@/lib/mutations/useDeleteTripPhase";

import { openDialog } from "@/store/uiDialogSlice";

import { AddLocationDialog } from "./AddLocationDialog";
import { LocationCard } from "./LocationCard";

interface TripPhaseSectionProps {
  phase:
    | TripPhase
    | { id: string; trip_id: string; title: string; description?: string; locations?: Location[] };
  tripId: string;
  journeys?: Journey[];
  isNoPhaseSection?: boolean;
}

export function TripPhaseSection({
  phase,
  tripId,
  journeys,
  isNoPhaseSection,
}: TripPhaseSectionProps) {
  const [showAddLocationDialog, setShowAddLocationDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [accordionValue, setAccordionValue] = useState<string[]>([phase.id]);

  const dispatch = useDispatch();
  const addJourney = useAddJourney(tripId);
  const deleteTripPhase = useDeleteTripPhase(tripId);

  // Helper to find journey between two locations
  function findJourney(fromId: string, toId: string) {
    return journeys?.find(
      (j) => j.departure_location_id === fromId && j.arrival_location_id === toId
    );
  }

  // Handler to add journey
  function handleAddJourney(journeyData: Omit<Journey, "id">) {
    addJourney.mutate(journeyData);
  }

  function handleEdit() {
    if ("order" in phase) {
      dispatch(openDialog({ type: "trip_phase", entity: phase as TripPhase }));
    }
  }

  function handleDelete() {
    setShowDeleteDialog(true);
  }

  function confirmDelete() {
    deleteTripPhase.mutate({ id: phase.id });
    setShowDeleteDialog(false);
  }

  const hasLocations = phase.locations && phase.locations.length > 0;
  const isOpen = accordionValue.includes(phase.id);

  // For no-phase section, render with accordion but simpler layout
  if (isNoPhaseSection) {
    return (
      <div className="bg-background rounded-lg border border-border">
        <Accordion type="multiple" value={accordionValue} onValueChange={setAccordionValue}>
          <AccordionItem value={phase.id} className="border-none">
            {/* Custom trigger with chevron on left for no-phase section */}
            <div className="flex items-center py-3.5 px-4 md:px-5">
              <button
                onClick={() => {
                  setAccordionValue(
                    isOpen
                      ? accordionValue.filter((id) => id !== phase.id)
                      : [...accordionValue, phase.id]
                  );
                }}
                className="mr-3 hover:bg-accent rounded p-1 transition-colors cursor-pointer"
              >
                <ChevronDown
                  className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div className="flex-1 flex items-center justify-between">
                <div className="flex items-center gap-4 lg:gap-11">
                  <h2 className="text-xl font-bold">{phase.title}</h2>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAddLocationDialog(true);
                    }}
                    className="h-8 px-3"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Location
                  </Button>
                </div>
              </div>
            </div>

            {/* Phase description */}
            {phase.description && (
              <div className="px-4 pb-2">
                <p className="text-muted-foreground">{phase.description}</p>
              </div>
            )}

            <AccordionContent className="mx-4 md:mx-5 pb-4 border-t border-border">
              {/* Show locations */}
              {hasLocations &&
                phase.locations?.map((loc, idx) => {
                  const nextLocation = phase.locations?.[idx + 1];
                  const journey = nextLocation ? findJourney(loc.id, nextLocation.id) : undefined;

                  return (
                    <LocationCard
                      key={loc.id}
                      location={loc}
                      tripId={tripId}
                      nextLocation={nextLocation}
                      journey={journey}
                      onAddJourney={handleAddJourney}
                    />
                  );
                })}

              {/* Show Add Location button when it has locations */}
              {hasLocations && (
                <div className="mt-4">
                  <Button variant="outline" onClick={() => setShowAddLocationDialog(true)}>
                    + Add Location
                  </Button>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Add Location Dialog */}
        <AddLocationDialog
          tripId={tripId}
          phaseId={undefined} // Don't pass phaseId for no-phase section
          open={showAddLocationDialog}
          onOpenChange={setShowAddLocationDialog}
        />
      </div>
    );
  }

  // For regular phases, use accordion
  return (
    <div className="bg-background rounded-lg border border-border">
      <Accordion type="multiple" value={accordionValue} onValueChange={setAccordionValue}>
        <AccordionItem value={phase.id} className="border-none">
          {/* Custom trigger with chevron on left */}
          <div className="flex items-center py-3.5 p-4 md:px-5">
            <button
              onClick={() => {
                setAccordionValue(
                  isOpen
                    ? accordionValue.filter((id) => id !== phase.id)
                    : [...accordionValue, phase.id]
                );
              }}
              className="mr-3 hover:bg-accent rounded p-1 transition-colors cursor-pointer"
            >
              <ChevronDown
                className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div className="flex-1 flex items-center justify-between">
              <div className="flex items-center gap-4 lg:gap-11">
                <h2 className="text-xl font-bold">{phase.title}</h2>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAddLocationDialog(true);
                  }}
                  className="h-8 px-3"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Location
                </Button>
              </div>

              {/* Action Menu for edit/delete */}
              {"order" in phase && (
                <ActionMenu>
                  <ActionMenuItem onSelect={handleEdit}>
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </ActionMenuItem>
                  <ActionMenuSeparator />
                  <ActionMenuItem
                    onSelect={handleDelete}
                    disabled={deleteTripPhase.isPending}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </ActionMenuItem>
                </ActionMenu>
              )}
            </div>
          </div>

          {/* Phase description */}
          {"description" in phase && phase.description && (
            <div className="px-4 pb-2">
              <p className="text-muted-foreground">{phase.description}</p>
            </div>
          )}

          <AccordionContent className="mx-4 md:mx-5 pb-4 border-t border-border">
            {/* Show locations if they exist */}
            {hasLocations &&
              phase.locations?.map((loc, idx) => {
                const nextLocation = phase.locations?.[idx + 1];
                const journey = nextLocation ? findJourney(loc.id, nextLocation.id) : undefined;

                return (
                  <LocationCard
                    key={loc.id}
                    location={loc}
                    tripId={tripId}
                    nextLocation={nextLocation}
                    journey={journey}
                    onAddJourney={handleAddJourney}
                  />
                );
              })}

            {/* Show empty state for phases without locations */}
            {!hasLocations && (
              <div className="text-center py-8 text-muted-foreground">
                <p className="mb-4">No locations added to this phase yet.</p>
                <Button onClick={() => setShowAddLocationDialog(true)}>Add First Location</Button>
              </div>
            )}

            {/* Show Add Location button at bottom for phases with locations */}
            {hasLocations && (
              <div className="mt-4">
                <Button variant="outline" onClick={() => setShowAddLocationDialog(true)}>
                  + Add Location
                </Button>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Add Location Dialog */}
      <AddLocationDialog
        tripId={tripId}
        phaseId={phase.id}
        open={showAddLocationDialog}
        onOpenChange={setShowAddLocationDialog}
      />

      {/* Delete Confirmation Dialog */}
      {"order" in phase && (
        <ConfirmDeleteDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          title={`Delete "${phase.title}"?`}
          description="This action cannot be undone. All locations, accommodations, activities, and journeys within this phase will be permanently deleted."
          onConfirm={confirmDelete}
          loading={deleteTripPhase.isPending}
        />
      )}
    </div>
  );
}
