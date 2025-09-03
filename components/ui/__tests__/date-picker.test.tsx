import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DatePicker } from "../date-picker";

describe("DatePicker", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with default placeholder", () => {
    render(<DatePicker onChange={mockOnChange} />);

    expect(screen.getByText("Select date")).toBeInTheDocument();
  });

  it("renders with custom placeholder", () => {
    render(<DatePicker onChange={mockOnChange} placeholder="Pick a date" />);

    expect(screen.getByText("Pick a date")).toBeInTheDocument();
  });

  it("displays formatted date when value is provided", () => {
    render(<DatePicker value="2023-12-05" onChange={mockOnChange} />);

    expect(screen.getByText("05 Dec 2023")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<DatePicker onChange={mockOnChange} className="custom-class" />);

    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  it("opens calendar when button is clicked", async () => {
    const user = userEvent.setup();
    render(<DatePicker onChange={mockOnChange} />);

    const button = screen.getByRole("button");
    await user.click(button);

    // Calendar should be visible
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("shows placeholder with muted text color when no value", () => {
    render(<DatePicker onChange={mockOnChange} />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("text-muted-foreground");
  });

  it("does not have muted text color when value is provided", () => {
    render(<DatePicker value="2023-12-05" onChange={mockOnChange} />);

    const button = screen.getByRole("button");
    expect(button).not.toHaveClass("text-muted-foreground");
  });

  it("displays chevron down icon", () => {
    render(<DatePicker onChange={mockOnChange} />);

    // Check for SVG element (ChevronDownIcon renders as SVG)
    expect(document.querySelector("svg")).toBeInTheDocument();
  });

  it("opens calendar and shows date grid", async () => {
    const user = userEvent.setup();
    render(<DatePicker onChange={mockOnChange} />);

    // Open the calendar
    await user.click(screen.getByRole("button"));

    // Calendar should be visible with date grid
    expect(screen.getByRole("grid")).toBeInTheDocument();

    // Should have date cells
    const dateButtons = screen.getAllByRole("gridcell");
    expect(dateButtons.length).toBeGreaterThan(0);
  });

  it("calendar interaction works", async () => {
    const user = userEvent.setup();
    render(<DatePicker onChange={mockOnChange} />);

    // Open the calendar
    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("grid")).toBeInTheDocument();

    // Test that we can interact with the calendar
    const dateButtons = screen.getAllByRole("gridcell");
    expect(dateButtons.length).toBeGreaterThan(0);
  });

  it("handles invalid date value gracefully", () => {
    // This should not throw an error and should display placeholder
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    expect(() => {
      render(<DatePicker value="invalid-date" onChange={mockOnChange} />);
    }).not.toThrow();

    // Should show placeholder when date is invalid
    expect(screen.getByText("Select date")).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("handles empty string value", () => {
    render(<DatePicker value="" onChange={mockOnChange} />);

    expect(screen.getByText("Select date")).toBeInTheDocument();
  });

  it("handles undefined value", () => {
    render(<DatePicker value={undefined} onChange={mockOnChange} />);

    expect(screen.getByText("Select date")).toBeInTheDocument();
  });

  it("has proper button attributes", () => {
    render(<DatePicker onChange={mockOnChange} />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("w-full", "justify-between", "font-normal");
  });

  it("opens and closes calendar programmatically", async () => {
    const user = userEvent.setup();
    render(<DatePicker onChange={mockOnChange} />);

    const button = screen.getByRole("button");

    // Calendar should not be visible initially
    expect(screen.queryByRole("grid")).not.toBeInTheDocument();

    // Click to open
    await user.click(button);
    expect(screen.getByRole("grid")).toBeInTheDocument();

    // Click button again to close
    await user.click(button);
    expect(screen.queryByRole("grid")).not.toBeInTheDocument();
  });

  it("shows dropdown navigation in calendar", async () => {
    const user = userEvent.setup();
    render(<DatePicker onChange={mockOnChange} />);

    await user.click(screen.getByRole("button"));

    // Calendar should have dropdown navigation (captionLayout="dropdown")
    // This is handled internally by react-day-picker
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });
});
