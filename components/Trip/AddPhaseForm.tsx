"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useAddTripPhase } from "@/lib/mutations/useAddTripPhase";

interface AddPhaseFormProps {
  tripId: string;
}

export function AddPhaseForm({ tripId }: AddPhaseFormProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const { mutate: addPhase, isPending } = useAddTripPhase(tripId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    addPhase(title, {
      onSuccess: () => {
        setTitle("");
        setIsAdding(false);
      },
    });
  }

  if (!isAdding) {
    return (
      <Button onClick={() => setIsAdding(true)} size="sm">
        + Add Phase
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter phase title"
        disabled={isPending}
        className="w-full max-w-xs"
      />
      <Button type="submit" size="sm" disabled={isPending}>
        Save
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => {
          setTitle("");
          setIsAdding(false);
        }}
      >
        Cancel
      </Button>
    </form>
  );
}
