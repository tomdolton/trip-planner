"use client";

import { House, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";

import { Accommodation } from "@/types/trip";

import { ActionMenu, ActionMenuItem, ActionMenuSeparator } from "@/components/ui/ActionMenu";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmDeleteDialog } from "@/components/ui/ConfirmDeleteDialog";

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
    <>
      <Card className="mt-4 @container">
        <CardContent className="p-6 flex gap-4 @md:gap-8">
          <span className="inline-flex p-2 bg-secondary rounded-xl mb-6">
            <House className="size-8" />
          </span>

          <div
            className="space-y-4 flex-1 cursor-pointer"
            onClick={() => dispatch(openDialog({ type: "accommodation", entity: accommodation }))}
          >
            <p className="text-xl font-semibold">Staying: {accommodation.name} </p>

            {accommodation.check_in && (
              <p className="text-muted-foreground text-semibold">
                {formatDateRange(accommodation.check_in, accommodation.check_out)}
              </p>
            )}
          </div>

          {/* Action Menu */}
          <ActionMenu>
            <ActionMenuItem onSelect={handleEdit}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </ActionMenuItem>
            <ActionMenuSeparator />
            <ActionMenuItem
              onSelect={handleDelete}
              disabled={deleteAccommodation.isPending}
              className="text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </ActionMenuItem>
          </ActionMenu>
        </CardContent>
      </Card>

      <ConfirmDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title={`Delete "${accommodation.name}"?`}
        description="This action cannot be undone. All data associated with this accommodation will be permanently deleted."
        onConfirm={confirmDelete}
        loading={deleteAccommodation.isPending}
      />
    </>
  );
}
