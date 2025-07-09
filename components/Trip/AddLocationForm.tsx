"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAddLocation } from "@/lib/mutations/useAddLocation";

interface AddLocationFormProps {
  tripId: string;
  phaseId: string;
}

export function AddLocationForm({ tripId, phaseId }: AddLocationFormProps) {
  const [name, setName] = useState("");
  const { mutate: addLocation } = useAddLocation(tripId);

  function handleAdd() {
    if (!name.trim()) return;
    addLocation({ phaseId, name });
    setName("");
  }

  return (
    <div className="mt-4 flex gap-2 items-center">
      <Input
        type="text"
        className="w-full max-w-xs"
        placeholder="New location name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button size="sm" variant="secondary" onClick={handleAdd}>
        + Add Location
      </Button>
    </div>
  );
}
