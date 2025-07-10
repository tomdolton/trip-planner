import { useSelector, useDispatch } from "react-redux";

import { RootState } from "@/store";
import { isAccommodation, isActivity, isLocation } from "@/types/guards";

import { EditAccommodationDialog } from "./EditAccommodationDialog";
import { EditActivityDialog } from "./EditActivityDialog";
import { EditLocationDialog } from "./EditLocationDialog";

import { closeDialog } from "@/store/uiDialogSlice";

export function EditEntityDialog({ tripId }: { tripId: string }) {
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
  return null;
}
