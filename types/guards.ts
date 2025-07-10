import type { Activity, Accommodation, Location } from "@/types/trip";

export function isActivity(entity: unknown): entity is Activity {
  return (
    entity !== null && typeof entity === "object" && "activity_type" in entity && "date" in entity
  );
}

export function isAccommodation(entity: unknown): entity is Accommodation {
  return (
    entity !== null && typeof entity === "object" && "check_in" in entity && "check_out" in entity
  );
}

export function isLocation(entity: unknown): entity is Location {
  return (
    entity !== null && typeof entity === "object" && "trip_phase_id" in entity && "name" in entity
  );
}
