import { configureStore } from "@reduxjs/toolkit";

import uiDialogReducer from "./uiDialogSlice";

export const store = configureStore({
  reducer: {
    uiDialog: uiDialogReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
