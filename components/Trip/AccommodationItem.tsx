"use client";

import { useDispatch } from "react-redux";

import { Accommodation } from "@/types/trip";

import { formatDateRange } from "@/lib/utils/formatDateRange";

import { openDialog } from "@/store/uiDialogSlice";

interface AccommodationItemProps {
  accommodation: Accommodation;
}

export function AccommodationItem({ accommodation }: AccommodationItemProps) {
  const dispatch = useDispatch();

  return (
    <div
      onClick={() => dispatch(openDialog({ type: "accommodation", entity: accommodation }))}
      className="flex items-center gap-2 cursor-pointer p-2 rounded"
    >
      <p className="text-sm text-muted-foreground">
        🏨 {accommodation.name}{" "}
        {accommodation.check_in && (
          <span className="text-xs">
            ({formatDateRange(accommodation.check_in, accommodation.check_out)})
          </span>
        )}
      </p>
    </div>
  );
}
