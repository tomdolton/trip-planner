import { render, screen } from "@testing-library/react";

import { LocationActions } from "../LocationActions";

// Mock the dialog components
jest.mock("../AddAccommodationDialog", () => ({
  AddAccommodationDialog: ({ tripId, locationId }: { tripId: string; locationId: string }) => (
    <div data-testid="add-accommodation-dialog">
      Add Accommodation - Trip: {tripId}, Location: {locationId}
    </div>
  ),
}));

jest.mock("../AddActivityDialog", () => ({
  AddActivityDialog: ({ tripId, locationId }: { tripId: string; locationId: string }) => (
    <div data-testid="add-activity-dialog">
      Add Activity - Trip: {tripId}, Location: {locationId}
    </div>
  ),
}));

describe("LocationActions", () => {
  it("renders both add accommodation and add activity dialogs", () => {
    render(<LocationActions tripId="trip-1" locationId="location-1" />);

    expect(screen.getByTestId("add-accommodation-dialog")).toBeInTheDocument();
    expect(screen.getByTestId("add-activity-dialog")).toBeInTheDocument();
  });

  it("passes correct props to AddAccommodationDialog", () => {
    render(<LocationActions tripId="test-trip-id" locationId="test-location-id" />);

    const accommodationDialog = screen.getByTestId("add-accommodation-dialog");
    expect(accommodationDialog).toHaveTextContent("Trip: test-trip-id");
    expect(accommodationDialog).toHaveTextContent("Location: test-location-id");
  });

  it("passes correct props to AddActivityDialog", () => {
    render(<LocationActions tripId="test-trip-id" locationId="test-location-id" />);

    const activityDialog = screen.getByTestId("add-activity-dialog");
    expect(activityDialog).toHaveTextContent("Trip: test-trip-id");
    expect(activityDialog).toHaveTextContent("Location: test-location-id");
  });

  it("applies custom className", () => {
    const { container } = render(
      <LocationActions tripId="trip-1" locationId="location-1" className="custom-class" />
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("applies default styling classes", () => {
    const { container } = render(<LocationActions tripId="trip-1" locationId="location-1" />);

    expect(container.firstChild).toHaveClass("flex", "flex-col", "gap-4", "@md:flex-row");
  });

  it("renders with different tripId and locationId", () => {
    render(<LocationActions tripId="different-trip" locationId="different-location" />);

    expect(
      screen.getByText("Add Accommodation - Trip: different-trip, Location: different-location")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Add Activity - Trip: different-trip, Location: different-location")
    ).toBeInTheDocument();
  });
});
