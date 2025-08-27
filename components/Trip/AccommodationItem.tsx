"use client";

import { House, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";

import { Accommodation } from "@/types/trip";

import { ActionMenu, ActionMenuItem, ActionMenuSeparator } from "@/components/ui/ActionMenu";
import { ConfirmDeleteDialog } from "@/components/ui/ConfirmDeleteDialog";
import { TripItemCard } from "@/components/ui/TripItemCard";

import { useDeleteAccommodation } from "@/lib/mutations/useDeleteAccommodation";
import { formatDateRange } from "@/lib/utils/dateTime";

import { openDialog } from "@/store/uiDialogSlice";

interface AccommodationItemProps {
  accommodation: Accommodation;
  tripId: string;
}

export function AccommodationItem({ accommodation, tripId }: AccommodationItemProps) {
  const dispatch = useDispatch();
  const deleteAccommodation = useDeleteAccommodation(tripId);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  function handleEdit() {
    dispatch(openDialog({ type: "accommodation", entity: accommodation }));
  }

  function handleDelete() {
    setShowDeleteDialog(true);
  }

  function confirmDelete() {
    deleteAccommodation.mutate({ id: accommodation.id });
    setShowDeleteDialog(false);
  }

  return (
    <div className="@container" id={`accommodation-${accommodation.id}`}>
      <TripItemCard className="flex items-start gap-4 p-4 @md:gap-6 @md:p-6" hoverEffect>
        <span className="bg-secondary inline-flex rounded-xl p-2">
          <House className="size-8" strokeWidth={1} />
        </span>

        <div
          className="flex-1 cursor-pointer space-y-4"
          onClick={() => dispatch(openDialog({ type: "accommodation", entity: accommodation }))}
        >
          <h4 className="text-xl font-semibold">
            <span className="text-muted-foreground me-1">Staying:</span> {accommodation.name}{" "}
          </h4>

          {accommodation.check_in && (
            <p className="text-muted-foreground text-semibold">
              {formatDateRange(accommodation.check_in, accommodation.check_out)}
            </p>
          )}
        </div>

        {/* Action Menu */}
        <ActionMenu>
          <ActionMenuItem onSelect={handleEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </ActionMenuItem>
          <ActionMenuSeparator />
          <ActionMenuItem
            onSelect={handleDelete}
            disabled={deleteAccommodation.isPending}
            className="text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </ActionMenuItem>
        </ActionMenu>
      </TripItemCard>

      <ConfirmDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title={`Delete "${accommodation.name}"?`}
        description="This action cannot be undone. All data associated with this accommodation will be permanently deleted."
        onConfirm={confirmDelete}
        loading={deleteAccommodation.isPending}
      />
    </div>
  );
}
