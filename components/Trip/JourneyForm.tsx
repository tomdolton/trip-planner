"use client";

import { useState } from "react";

import { Journey, Location } from "@/types/trip";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { journeyModes, journeyModeLabels, journeyModeIcons } from "@/lib/constants/journeyModes";

interface JourneyFormProps {
  fromLocation: Location;
  toLocation: Location;
  tripId: string;
  onAddJourney: (data: Omit<Journey, "id">) => void;
  onCancel: () => void;
}

export function JourneyForm({
  fromLocation,
  toLocation,
  tripId,
  onAddJourney,
  onCancel,
}: JourneyFormProps) {
  const [form, setForm] = useState({
    mode: "",
    name: "",
    departure_time: "",
    arrival_time: "",
    notes: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleModeChange(value: string) {
    setForm({ ...form, mode: value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onAddJourney({
      trip_id: tripId,
      departure_location_id: fromLocation.id,
      arrival_location_id: toLocation.id,
      mode: form.mode,
      notes: form.notes,
      provider: form.name,
      departure_time: form.departure_time,
      arrival_time: form.arrival_time,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-lg p-2 shadow">
      <div className="flex gap-2 items-center mb-2">
        <Input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Journey name/provider"
          className="w-32"
        />
        <Select value={form.mode} onValueChange={handleModeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select mode" />
          </SelectTrigger>
          <SelectContent>
            {journeyModes.map((mode) => (
              <SelectItem key={mode} value={mode}>
                <span className="mr-2">{journeyModeIcons[mode]}</span>
                {journeyModeLabels[mode]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          name="departure_time"
          value={form.departure_time}
          onChange={handleChange}
          placeholder="Departure date & time"
          type="datetime-local"
          className="w-48"
        />
        <Input
          name="arrival_time"
          value={form.arrival_time}
          onChange={handleChange}
          placeholder="Arrival date & time"
          type="datetime-local"
          className="w-48"
        />
        <Textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Notes"
          className="w-40"
        />
      </div>
      <div className="flex gap-2 items-center">
        <Button type="submit" size="sm">
          Save
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
