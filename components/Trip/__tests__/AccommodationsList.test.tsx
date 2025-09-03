import { render, screen } from "@testing-library/react";

import { Accommodation } from "@/types/trip";

import { AccommodationsList } from "../AccommodationsList";

// Mock AccommodationItem to avoid dependency issues
jest.mock("../AccommodationItem", () => ({
  AccommodationItem: ({ accommodation }: { accommodation: Accommodation }) => (
    <div data-testid={`accommodation-${accommodation.id}`}>{accommodation.name}</div>
  ),
}));

describe("AccommodationsList", () => {
  const mockAccommodations: Accommodation[] = [
    {
      id: "acc-1",
      trip_id: "trip-1",
      location_id: "location-1",
      name: "Test Hotel 1",
    },
    {
      id: "acc-2",
      trip_id: "trip-1",
      location_id: "location-1",
      name: "Test Hotel 2",
    },
  ];

  it("renders list of accommodations", () => {
    render(<AccommodationsList accommodations={mockAccommodations} tripId="trip-1" />);

    expect(screen.getByText("Test Hotel 1")).toBeInTheDocument();
    expect(screen.getByText("Test Hotel 2")).toBeInTheDocument();
  });

  it("renders nothing when accommodations array is empty", () => {
    const { container } = render(<AccommodationsList accommodations={[]} tripId="trip-1" />);
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when accommodations is null", () => {
    const { container } = render(
      <AccommodationsList accommodations={null as unknown as Accommodation[]} tripId="trip-1" />
    );
    expect(container.firstChild).toBeNull();
  });

  it("applies custom className", () => {
    const { container } = render(
      <AccommodationsList
        accommodations={mockAccommodations}
        tripId="trip-1"
        className="custom-class"
      />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders accommodations with correct keys", () => {
    render(<AccommodationsList accommodations={mockAccommodations} tripId="trip-1" />);

    // Both accommodations should be rendered
    const accommodationItems = screen.getAllByText(/Test Hotel/);
    expect(accommodationItems).toHaveLength(2);
  });
});
