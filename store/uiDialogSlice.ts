import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { Activity, Accommodation, Location, Journey, TripPhase } from "@/types/trip";

type DialogType = "location" | "accommodation" | "activity" | "journey" | "trip_phase" | null;

export type EntityType = Activity | Accommodation | Location | Journey | TripPhase | null;

interface DialogState {
  open: boolean;
  type: DialogType;
  entity: EntityType;
}

const initialState: DialogState = {
  open: false,
  type: null,
  entity: null,
};

const uiDialogSlice = createSlice({
  name: "uiDialog",
  initialState,
  reducers: {
    openDialog: (
      state,
      action: PayloadAction<{
        type: DialogType;
        entity: EntityType;
      }>
    ) => {
      state.open = true;
      state.type = action.payload.type;
      state.entity = action.payload.entity;
    },
    closeDialog: (state) => {
      state.open = false;
      state.type = null;
      state.entity = null;
    },
  },
});

export const { openDialog, closeDialog } = uiDialogSlice.actions;
export default uiDialogSlice.reducer;
