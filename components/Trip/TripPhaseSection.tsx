"use client";

import { Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";

import { TripPhase, Journey, Location } from "@/types/trip";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ActionMenu, ActionMenuItem, ActionMenuSeparator } from "@/components/ui/ActionMenu";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "@/components/ui/ConfirmDeleteDialog";

import { useAddJourney } from "@/lib/mutations/useAddJourney";
import { useDeleteTripPhase } from "@/lib/mutations/useDeleteTripPhase";

import { useJourneyHelpers } from "@/hooks/useJourneyHelpers";

import { openDialog } from "@/store/uiDialogSlice";

import { AddJourneyDialog } from "./AddJourneyDialog";
import { AddLocationDialog } from "./AddLocationDialog";
import { JourneyDetails } from "./JourneyDetails";
import { JourneySection } from "./JourneySection";
import { LocationCard } from "./LocationCard";

interface TripPhaseSectionProps {
  phase:
    | TripPhase
    | { id: string; trip_id: string; title: string; description?: string; locations?: Location[] };
  tripId: string;
  journeys?: Journey[];
  isNoPhaseSection?: boolean;
  allPhases?: TripPhase[];
  phaseIndex?: number;
}

export function TripPhaseSection({
  phase,
  tripId,
  journeys,
  isNoPhaseSection,
  allPhases = [],
  phaseIndex = 0,
}: TripPhaseSectionProps) {
  const [showAddLocationDialog, setShowAddLocationDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [accordionValue, setAccordionValue] = useState<string[]>([phase.id]);

  const dispatch = useDispatch();
  const addJourney = useAddJourney(tripId);
  const deleteTripPhase = useDeleteTripPhase(tripId);

  // Use the journey helpers hook
  const {
    findJourney,
    findStartJourney,
    findEndJourney,
    findCrossPhaseJourneyToNext,
    getCrossPhaseJourneyLocationsToNext,
    shouldShowCrossPhaseJourney,
    shouldShowStartJourney,
    shouldShowEndJourney,
  } = useJourneyHelpers({
    journeys,
    allPhases,
    currentPhase: phase,
    phaseIndex,
  });

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

  // Shared header content component
  const HeaderButtons = () => (
    <div className="flex items-center gap-4">
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

      {/* Show start journey button in header */}
      {hasLocations &&
        shouldShowStartJourney() &&
        !findStartJourney() &&
        (() => {
          const firstLocation = phase.locations?.[0];
          if (!firstLocation) return null;

          return (
            <AddJourneyDialog
              tripId={tripId}
              fromLocation={null}
              toLocation={firstLocation}
              onAddJourney={handleAddJourney}
              title="Add Start Journey"
            >
              <Button variant="outline" size="sm" className="h-8 px-3">
                <Plus className="w-4 h-4 mr-1" />
                Start Journey
              </Button>
            </AddJourneyDialog>
          );
        })()}
    </div>
  );

  // Shared start journey section component
  const StartJourneySection = () => {
    if (!hasLocations || !shouldShowStartJourney()) return null;

    const firstLocation = phase.locations?.[0];
    const startJourney = findStartJourney();

    if (!firstLocation || !startJourney) return null;

    return (
      <div className="mb-4">
        <JourneySection
          fromLocation={null}
          toLocation={firstLocation}
          tripId={tripId}
          journey={startJourney}
          onAddJourney={handleAddJourney}
          phaseId={isNoPhaseSection ? undefined : phase.id}
        />
      </div>
    );
  };

  // Shared locations and journeys component
  const LocationsAndJourneys = () => {
    if (!hasLocations) return null;

    return (
      <>
        {phase.locations?.map((loc, idx) => {
          const nextLocation = phase.locations?.[idx + 1];
          const journey = nextLocation ? findJourney(loc.id, nextLocation.id) : undefined;

          return (
            <div key={loc.id}>
              <LocationCard location={loc} tripId={tripId} />

              {/* Render journey as separate card between locations */}
              {nextLocation && (
                <JourneySection
                  fromLocation={loc}
                  toLocation={nextLocation}
                  tripId={tripId}
                  journey={journey}
                  onAddJourney={handleAddJourney}
                  phaseId={isNoPhaseSection ? undefined : phase.id}
                />
              )}
            </div>
          );
        })}
      </>
    );
  };

  // Shared end journey section component
  const EndJourneySection = () => {
    if (!hasLocations || !shouldShowEndJourney()) return null;

    const lastLocation = phase.locations?.[phase.locations.length - 1];
    const endJourney = findEndJourney();

    if (!lastLocation) return null;

    return (
      <div className="mt-4">
        {endJourney ? (
          <JourneySection
            fromLocation={lastLocation}
            toLocation={null}
            tripId={tripId}
            journey={endJourney}
            onAddJourney={handleAddJourney}
            phaseId={isNoPhaseSection ? undefined : phase.id}
          />
        ) : null}
      </div>
    );
  };

  // Shared bottom action buttons component
  const BottomActionButtons = () => {
    if (!hasLocations) return null;

    return (
      <div className="mt-4 flex items-center gap-2">
        <Button variant="outline" onClick={() => setShowAddLocationDialog(true)}>
          <Plus className="w-4 h-4 mr-1" />
          Add Location
        </Button>

        {/* Show end journey button inline */}
        {shouldShowEndJourney() &&
          !findEndJourney() &&
          (() => {
            const lastLocation = phase.locations?.[phase.locations.length - 1];
            if (!lastLocation) return null;

            return (
              <AddJourneyDialog
                tripId={tripId}
                fromLocation={lastLocation}
                toLocation={null}
                onAddJourney={handleAddJourney}
                title="Add End Journey"
              >
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-1" />
                  End Journey
                </Button>
              </AddJourneyDialog>
            );
          })()}

        {/* Show cross-phase journey button inline - only for regular phases */}
        {!isNoPhaseSection &&
          shouldShowCrossPhaseJourney() &&
          (() => {
            const crossPhaseData = getCrossPhaseJourneyLocationsToNext();
            const crossPhaseJourney = findCrossPhaseJourneyToNext();

            if (!crossPhaseData || crossPhaseJourney) return null;

            const { fromLocation, toLocation, nextPhase } = crossPhaseData;

            return (
              <AddJourneyDialog
                tripId={tripId}
                fromLocation={fromLocation}
                toLocation={toLocation}
                onAddJourney={handleAddJourney}
                title="Add Inter-Phase Journey"
              >
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-1" />
                  Journey to {nextPhase.title}
                </Button>
              </AddJourneyDialog>
            );
          })()}
      </div>
    );
  };

  // Cross-phase journey details component (only for regular phases)
  const CrossPhaseJourneyDetails = () => {
    if (isNoPhaseSection || !hasLocations || !shouldShowCrossPhaseJourney()) return null;

    const crossPhaseData = getCrossPhaseJourneyLocationsToNext();
    const crossPhaseJourney = findCrossPhaseJourneyToNext();

    if (!crossPhaseData || !crossPhaseJourney) return null;

    const { fromLocation, toLocation } = crossPhaseData;

    return (
      <div className="mt-4">
        <JourneyDetails
          journey={crossPhaseJourney}
          tripId={tripId}
          departureLocationName={fromLocation.name}
          arrivalLocationName={toLocation.name}
        />
      </div>
    );
  };

  // Main accordion content
  const AccordionContentSection = () => (
    <AccordionContent className="mx-4 md:mx-5 pb-4 border-t border-border">
      <StartJourneySection />
      <LocationsAndJourneys />
      <EndJourneySection />

      {/* Show empty state for phases without locations - only for regular phases */}
      {!hasLocations && !isNoPhaseSection && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="mb-4">No locations added to this phase yet.</p>
          <Button onClick={() => setShowAddLocationDialog(true)}>Add First Location</Button>
        </div>
      )}

      <BottomActionButtons />
      <CrossPhaseJourneyDetails />
    </AccordionContent>
  );

  return (
    <div className="bg-card rounded-lg border border-border">
      <Accordion type="multiple" value={accordionValue} onValueChange={setAccordionValue}>
        <AccordionItem value={phase.id} className="border-none">
          <div className="flex items-center py-3.5 px-4 md:px-5 @container">
            <AccordionTrigger
              chevronAlign="left"
              className="flex items-center gap-3 hover:no-underline mr-4 @lg:mr-8 cursor-pointer"
            >
              <h2 className="text-xl font-bold">{phase.title}</h2>
            </AccordionTrigger>

            <HeaderButtons />

            {/* Action Menu for edit/delete - only for regular phases */}
            {!isNoPhaseSection && "order" in phase && (
              <ActionMenu className="ml-auto">
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

          {/* Phase description */}
          {phase.description && (
            <div className="px-4 pb-2">
              <p className="text-muted-foreground">{phase.description}</p>
            </div>
          )}

          <AccordionContentSection />
        </AccordionItem>
      </Accordion>

      {/* Add Location Dialog */}
      <AddLocationDialog
        tripId={tripId}
        phaseId={isNoPhaseSection ? undefined : phase.id}
        open={showAddLocationDialog}
        onOpenChange={setShowAddLocationDialog}
      />

      {/* Delete Confirmation Dialog - only for regular phases */}
      {!isNoPhaseSection && "order" in phase && (
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
