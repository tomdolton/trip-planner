import { configureStore } from '@reduxjs/toolkit';
import tripsReducer from '@/features/trips/tripsSlice';
import uiReducer from '@/features/ui/darkModeSlice';

export const store = configureStore({
  reducer: {
    trips: tripsReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
