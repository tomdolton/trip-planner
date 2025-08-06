import { useQuery } from "@tanstack/react-query";

import { Trip, TripPhase, Location } from "@/types/trip";

import { supabase } from "@/lib/supabase";

export function useTripDetail(tripId: string) {
  return useQuery({
    queryKey: ["trip", tripId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trips")
        .select(
          `
          *,
          trip_phases (
            *,
            locations (
              *,
              place:places(*),
              accommodations(*),
              activities(*)
            )
          ),
          unassigned_locations:locations!locations_trip_id_fkey (
            *,
            place:places(*),
            accommodations(*),
            activities(*)
          ),
          journeys(*)
        `
        )
        .eq("id", tripId)
        .single();

      if (error) {
        console.error("Trip detail query error:", error);
        throw new Error(error.message);
      }

      // Filter out locations from unassigned_locations that are already in phases
      const phaseLocationIds = new Set(
        data.trip_phases?.flatMap(
          (phase: TripPhase) => phase.locations?.map((loc: Location) => loc.id) || []
        ) || []
      );

      data.unassigned_locations =
        data.unassigned_locations?.filter(
          (location: Location) => !phaseLocationIds.has(location.id)
        ) || [];

      console.log("📊 Trip data loaded:", data);
      console.log("📊 Phase location IDs:", Array.from(phaseLocationIds));
      console.log("📊 Filtered unassigned locations:", data.unassigned_locations);

      return data as Trip;
    },
    enabled: !!tripId,
  });
}
