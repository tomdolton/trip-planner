import { render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";

import type { AccommodationFormValues } from "@/types/forms";

import { AccommodationFormFields } from "../AccommodationFormFields";

// Mock the usePlaceSelection hook
const mockUsePlaceSelection = jest.fn();
jest.mock("@/hooks/usePlaceSelection", () => ({
  usePlaceSelection: () => mockUsePlaceSelection(),
}));

jest.mock("@/components/ui/PlaceSelectionField", () => ({
  PlaceSelectionField: ({ placeholder }: { placeholder?: string }) => (
    <div data-testid="place-selection-field">
      <input placeholder={placeholder} />
    </div>
  ),
}));

jest.mock("@/components/ui/PlaceToggleButton", () => ({
  PlaceToggleButton: ({ manualText }: { manualText: string }) => <button>{manualText}</button>,
}));

// Test component wrapper - simplify by not using zod resolver
function TestWrapper({ onSubmit }: { onSubmit: jest.Mock }) {
  const form = useForm<AccommodationFormValues>({
    defaultValues: {
      name: "",
      check_in: undefined,
      check_out: undefined,
      url: "",
      notes: "",
    },
  });

  return (
    <AccommodationFormFields form={form} onSubmit={onSubmit}>
      <button type="submit">Submit</button>
    </AccommodationFormFields>
  );
}

describe("AccommodationFormFields", () => {
  let mockSubmit: jest.Mock;

  beforeEach(() => {
    mockSubmit = jest.fn();
    jest.clearAllMocks();
    // Set default mock return value
    mockUsePlaceSelection.mockReturnValue({
      selectedPlace: null,
      isManualMode: false,
      handlePlaceSelected: jest.fn(),
      clearPlace: jest.fn(),
      toggleManualMode: jest.fn(),
    });
  });

  it("renders all basic form elements", () => {
    render(<TestWrapper onSubmit={mockSubmit} />);

    expect(screen.getByTestId("place-selection-field")).toBeInTheDocument();
    expect(screen.getByText("Enter Accommodation Manually")).toBeInTheDocument();
    expect(screen.getByText("Check-in")).toBeInTheDocument();
    expect(screen.getByText("Check-out")).toBeInTheDocument();
    expect(screen.getByLabelText("Booking URL")).toBeInTheDocument();
    expect(screen.getByLabelText("Notes")).toBeInTheDocument();
  });

  it("renders children at the bottom of the form", () => {
    render(<TestWrapper onSubmit={mockSubmit} />);

    expect(screen.getByText("Submit")).toBeInTheDocument();
  });
});
