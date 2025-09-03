import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";

// Mock the Supabase-dependent mutation hook before importing the component
jest.mock("@/lib/mutations/useDeleteAccommodation", () => ({
  useDeleteAccommodation: () => ({
    mutate: jest.fn(),
    isPending: false,
  }),
}));

import { AccommodationItem } from "../AccommodationItem";

// Create a minimal Redux store
const store = configureStore({
  reducer: {
    ui: (state = {}) => state,
  },
});

describe("AccommodationItem", () => {
  const mockAccommodation = {
    id: "1",
    name: "Test Hotel",
    check_in: "2024-01-15",
    check_out: "2024-01-20",
    url: "https://booking.com/test-hotel",
    notes: "Nice hotel",
    location_id: "loc_1",
    trip_id: "trip_1",
  };

  it("renders basic accommodation information", () => {
    render(
      <Provider store={store}>
        <AccommodationItem accommodation={mockAccommodation} tripId="trip_1" />
      </Provider>
    );

    expect(screen.getByText("Test Hotel")).toBeInTheDocument();
  });
});
