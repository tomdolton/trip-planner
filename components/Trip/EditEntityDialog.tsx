import { useSelector, useDispatch } from "react-redux";

import { RootState } from "@/store";
import { isAccommodation, isActivity, isLocation, isJourney, isTripPhase } from "@/types/guards";
import { TripPhase, Trip } from "@/types/trip";

import { closeDialog } from "@/store/uiDialogSlice";

import { EditAccommodationDialog } from "./EditAccommodationDialog";
import { EditActivityDialog } from "./EditActivityDialog";
import { EditJourneyDialog } from "./EditJourneyDialog";
import { EditLocationDialog } from "./EditLocationDialog";
import { EditTripPhaseDialog } from "./EditTripPhaseDialog";

export function EditEntityDialog({
  tripId,
  phases = [],
  trip,
}: {
  tripId: string;
  phases?: TripPhase[];
  trip?: Trip;
}) {
  const { open, type, entity } = useSelector((state: RootState) => state.uiDialog);
  const dispatch = useDispatch();

  if (!open || !type || !entity) return null;

  if (type === "location" && isLocation(entity)) {
    return (
      <EditLocationDialog
        location={entity}
        open={open}
        onOpenChange={(v: boolean) => !v && dispatch(closeDialog())}
        tripId={tripId}
        phases={phases}
      />
    );
  }

  if (type === "accommodation" && isAccommodation(entity)) {
    return (
      <EditAccommodationDialog
        accommodation={entity}
        open={open}
        onOpenChange={(v: boolean) => !v && dispatch(closeDialog())}
        tripId={tripId}
      />
    );
  }

  if (type === "activity" && isActivity(entity)) {
    return (
      <EditActivityDialog
        activity={entity}
        open={open}
        onOpenChange={(v: boolean) => !v && dispatch(closeDialog())}
        tripId={tripId}
      />
    );
  }

  if (type === "journey" && isJourney(entity)) {
    // Find location names for the journey
    const allLocations = [
      ...(trip?.unassigned_locations || []),
      ...(trip?.trip_phases?.flatMap((phase) => phase.locations || []) || []),
    ];

    const departureLocation = allLocations.find((loc) => loc.id === entity.departure_location_id);
    const arrivalLocation = allLocations.find((loc) => loc.id === entity.arrival_location_id);

    return (
      <EditJourneyDialog
        journey={entity}
        open={open}
        onOpenChange={(v: boolean) => !v && dispatch(closeDialog())}
        tripId={tripId}
        departureLocationName={departureLocation?.name}
        arrivalLocationName={arrivalLocation?.name}
      />
    );
  }

  if (type === "trip_phase" && isTripPhase(entity)) {
    return (
      <EditTripPhaseDialog
        phase={entity}
        open={open}
        onOpenChange={(v: boolean) => !v && dispatch(closeDialog())}
        tripId={tripId}
      />
    );
  }

  return null;
}
