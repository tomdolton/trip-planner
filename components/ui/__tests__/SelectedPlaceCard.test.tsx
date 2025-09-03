import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SelectedPlaceCard } from "../SelectedPlaceCard";
import type { Place } from "@/types/trip";

const mockPlace: Place = {
  id: "123",
  name: "Test Place",
  formatted_address: "123 Test St, Test City",
  place_types: ["restaurant", "food", "point_of_interest"],
  lat: 40.7128,
  lng: -74.006,
  google_place_id: "test_place_id",
  is_google_place: true,
};

describe("SelectedPlaceCard", () => {
  const mockOnRemove = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders place information", () => {
    render(<SelectedPlaceCard place={mockPlace} onRemove={mockOnRemove} />);

    expect(screen.getByText("Test Place")).toBeInTheDocument();
    expect(screen.getByText("123 Test St, Test City")).toBeInTheDocument();
  });

  it("renders place without address", () => {
    const placeWithoutAddress = { ...mockPlace, formatted_address: undefined };
    render(<SelectedPlaceCard place={placeWithoutAddress} onRemove={mockOnRemove} />);

    expect(screen.getByText("Test Place")).toBeInTheDocument();
    expect(screen.queryByText("123 Test St, Test City")).not.toBeInTheDocument();
  });

  it("renders place with empty address", () => {
    const placeWithEmptyAddress = { ...mockPlace, formatted_address: "" };
    render(<SelectedPlaceCard place={placeWithEmptyAddress} onRemove={mockOnRemove} />);

    expect(screen.getByText("Test Place")).toBeInTheDocument();
    expect(screen.queryByText("123 Test St, Test City")).not.toBeInTheDocument();
  });

  it("displays remove button", () => {
    render(<SelectedPlaceCard place={mockPlace} onRemove={mockOnRemove} />);

    const removeButton = screen.getByRole("button");
    expect(removeButton).toBeInTheDocument();
    expect(removeButton).toHaveAccessibleName("Remove place");
  });

  it("calls onRemove when remove button is clicked", async () => {
    const user = userEvent.setup();
    render(<SelectedPlaceCard place={mockPlace} onRemove={mockOnRemove} />);

    const removeButton = screen.getByRole("button");
    await user.click(removeButton);

    expect(mockOnRemove).toHaveBeenCalledTimes(1);
  });

  it("displays map pin icon", () => {
    render(<SelectedPlaceCard place={mockPlace} onRemove={mockOnRemove} />);

    // Check if MapPin icon is present by looking for svg elements or the icon component
    const mapPinElement =
      document.querySelector("svg") || screen.getByRole("img", { hidden: true });
    expect(mapPinElement).toBeInTheDocument();
  });

  it("displays X icon on remove button", () => {
    render(<SelectedPlaceCard place={mockPlace} onRemove={mockOnRemove} />);

    // The remove button should have an X icon - check for button with X
    const removeButton = screen.getByRole("button");
    expect(removeButton.querySelector("svg")).toBeInTheDocument();
  });

  it("has proper card structure", () => {
    render(<SelectedPlaceCard place={mockPlace} onRemove={mockOnRemove} />);

    // Check for card components
    expect(screen.getByRole("button").closest('[data-slot="card"]')).toBeInTheDocument();
    expect(
      screen.getByText("Test Place").closest('[data-slot="card-content"]')
    ).toBeInTheDocument();
  });

  it("applies proper CSS classes for responsive design", () => {
    render(<SelectedPlaceCard place={mockPlace} onRemove={mockOnRemove} />);

    const card = screen.getByRole("button").closest('[data-slot="card"]');
    expect(card).toHaveClass("w-full");

    const cardContent = screen.getByText("Test Place").closest('[data-slot="card-content"]');
    expect(cardContent).toHaveClass("p-3", "md:p-4");
  });
});
