export interface Trip {
  id: string;
  title: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  trip_phases?: TripPhase[];
  journeys?: Journey[];
}

export interface TripPhase {
  id: string;
  trip_id: string;
  title: string;
  description?: string;
  order?: number;
  start_date?: string;
  end_date?: string;
  locations?: Location[];
}

export interface Location {
  id: string;
  trip_id: string;
  trip_phase_id?: string;
  name: string;
  region?: string;
  notes?: string;
  order?: number;
  lat?: number;
  lng?: number;
  accommodations?: Accommodation[];
  trip_days?: TripDay[];
}

export interface TripDay {
  id: string;
  trip_id: string;
  date: string;
  location_id: string;
  notes?: string;
  activities?: Activity[];
}

export interface Activity {
  id: string;
  trip_day_id: string;
  title: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  notes?: string;
  place_id?: string;
}

export interface Accommodation {
  id: string;
  location_id: string;
  trip_id: string;
  name: string;
  url?: string;
  check_in?: string;
  check_out?: string;
  notes?: string;
}

export interface Journey {
  id: string;
  trip_id: string;
  departure_location_id: string;
  arrival_location_id: string;
  departure_time?: string;
  arrival_time?: string;
  mode: string;
  notes?: string;
  provider?: string;
}
