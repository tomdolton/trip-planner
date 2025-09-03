import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Trip } from "@/types/trip";

import { TripHeader } from "../TripHeader";

// Mock components
jest.mock("../AddLocationDialog", () => ({
  AddLocationDialog: ({
    open,
    onOpenChange,
    tripId,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tripId: string;
  }) =>
    open ? (
      <div data-testid="add-location-dialog">
        Add Location Dialog - Trip: {tripId}
        <button onClick={() => onOpenChange(false)}>Close</button>
      </div>
    ) : null,
}));

jest.mock("../AddTripPhaseDialog", () => ({
  AddTripPhaseDialog: ({
    open,
    onOpenChange,
    tripId,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tripId: string;
  }) =>
    open ? (
      <div data-testid="add-trip-phase-dialog">
        Add Trip Phase Dialog - Trip: {tripId}
        <button onClick={() => onOpenChange(false)}>Close</button>
      </div>
    ) : null,
}));

jest.mock("../CreateNewDropdown", () => ({
  CreateNewDropdown: ({
    onAddPhase,
    onAddLocation,
  }: {
    onAddPhase: () => void;
    onAddLocation: () => void;
  }) => (
    <div data-testid="create-new-dropdown">
      <button onClick={onAddPhase}>Add Phase</button>
      <button onClick={onAddLocation}>Add Location</button>
    </div>
  ),
}));

jest.mock("../TripImage", () => ({
  TripImage: ({ trip }: { trip: Trip }) => (
    <div data-testid="trip-image">Trip Image for {trip.title}</div>
  ),
}));

// Mock the formatDateRange function
jest.mock("@/lib/utils/dateTime", () => ({
  formatDateRange: jest.fn((startDate: string, endDate: string) => `${startDate} - ${endDate}`),
}));

describe("TripHeader", () => {
  const mockTrip: Trip = {
    id: "trip-1",
    title: "Test Trip",
    start_date: "2024-01-15",
    end_date: "2024-01-22",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    description: "A wonderful test trip",
  };

  const mockOnEditClick = jest.fn();
  const mockOnDeleteClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders trip basic information", () => {
    render(<TripHeader trip={mockTrip} onEditClick={mockOnEditClick} />);

    expect(screen.getByText("Test Trip")).toBeInTheDocument();
    expect(screen.getByText("A wonderful test trip")).toBeInTheDocument();
    expect(screen.getByText("2024-01-15 - 2024-01-22")).toBeInTheDocument();
    expect(screen.getByTestId("trip-image")).toBeInTheDocument();
  });

  it("renders action menu with edit and delete options when onDeleteClick is provided", () => {
    render(
      <TripHeader trip={mockTrip} onEditClick={mockOnEditClick} onDeleteClick={mockOnDeleteClick} />
    );

    // The action menu should be present (ellipsis button)
    const actionMenuButton = screen.getByRole("button", { name: /open actions/i });
    expect(actionMenuButton).toBeInTheDocument();
  });

  it("renders action menu without delete option when onDeleteClick is not provided", () => {
    render(<TripHeader trip={mockTrip} onEditClick={mockOnEditClick} />);

    // The action menu should still be present
    const actionMenuButton = screen.getByRole("button", { name: /open actions/i });
    expect(actionMenuButton).toBeInTheDocument();
  });

  it("calls onEditClick when edit menu item is clicked", async () => {
    const user = userEvent.setup();
    render(
      <TripHeader trip={mockTrip} onEditClick={mockOnEditClick} onDeleteClick={mockOnDeleteClick} />
    );

    const actionMenuButton = screen.getByRole("button", { name: /open actions/i });
    await user.click(actionMenuButton);

    // Look for edit option in the menu
    const editOption = await screen.findByText("Edit");
    await user.click(editOption);

    expect(mockOnEditClick).toHaveBeenCalledTimes(1);
  });

  it("calls onDeleteClick when delete menu item is clicked", async () => {
    const user = userEvent.setup();
    render(
      <TripHeader trip={mockTrip} onEditClick={mockOnEditClick} onDeleteClick={mockOnDeleteClick} />
    );

    const actionMenuButton = screen.getByRole("button", { name: /open actions/i });
    await user.click(actionMenuButton);

    // Look for delete option in the menu
    const deleteOption = await screen.findByText("Delete");
    await user.click(deleteOption);

    expect(mockOnDeleteClick).toHaveBeenCalledTimes(1);
  });

  it("renders create new dropdown", () => {
    render(<TripHeader trip={mockTrip} onEditClick={mockOnEditClick} />);

    expect(screen.getByTestId("create-new-dropdown")).toBeInTheDocument();
  });

  it("opens add phase dialog when add phase is clicked", async () => {
    const user = userEvent.setup();
    render(<TripHeader trip={mockTrip} onEditClick={mockOnEditClick} />);

    const addPhaseButton = screen.getByText("Add Phase");
    await user.click(addPhaseButton);

    expect(screen.getByTestId("add-trip-phase-dialog")).toBeInTheDocument();
    expect(screen.getByText("Add Trip Phase Dialog - Trip: trip-1")).toBeInTheDocument();
  });

  it("opens add location dialog when add location is clicked", async () => {
    const user = userEvent.setup();
    render(<TripHeader trip={mockTrip} onEditClick={mockOnEditClick} />);

    const addLocationButton = screen.getByText("Add Location");
    await user.click(addLocationButton);

    expect(screen.getByTestId("add-location-dialog")).toBeInTheDocument();
    expect(screen.getByText("Add Location Dialog - Trip: trip-1")).toBeInTheDocument();
  });

  it("closes dialogs when close button is clicked", async () => {
    const user = userEvent.setup();
    render(<TripHeader trip={mockTrip} onEditClick={mockOnEditClick} />);

    // Open add phase dialog
    const addPhaseButton = screen.getByText("Add Phase");
    await user.click(addPhaseButton);

    expect(screen.getByTestId("add-trip-phase-dialog")).toBeInTheDocument();

    // Close the dialog
    const closeButton = screen.getByText("Close");
    await user.click(closeButton);

    expect(screen.queryByTestId("add-trip-phase-dialog")).not.toBeInTheDocument();
  });

  it("renders with trip description when provided", () => {
    render(<TripHeader trip={mockTrip} onEditClick={mockOnEditClick} />);

    expect(screen.getByText("A wonderful test trip")).toBeInTheDocument();
  });

  it("renders without trip description when not provided", () => {
    const tripWithoutDescription = { ...mockTrip, description: undefined };
    render(<TripHeader trip={tripWithoutDescription} onEditClick={mockOnEditClick} />);

    expect(screen.queryByText("A wonderful test trip")).not.toBeInTheDocument();
  });

  it("renders with tooltip for trip details", async () => {
    render(<TripHeader trip={mockTrip} onEditClick={mockOnEditClick} />);

    // Look for the info icon by its SVG classes
    const infoIcon = document.querySelector("svg.lucide-info");
    expect(infoIcon).toBeInTheDocument();
  });
});
