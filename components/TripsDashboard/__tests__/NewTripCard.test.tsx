import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import NewTripCard from "../NewTripCard";

describe("NewTripCard", () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it("should render correctly with default props", () => {
    render(<NewTripCard onClick={mockOnClick} />);

    expect(screen.getByRole("button", { name: /create a new trip/i })).toBeInTheDocument();
    expect(screen.getByText("Create a new trip")).toBeInTheDocument();
    expect(screen.getByText("Start creating the itinerary for your new trip")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create new trip/i })).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const { container } = render(<NewTripCard onClick={mockOnClick} className="custom-class" />);

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("should call onClick when card is clicked", async () => {
    const user = userEvent.setup();
    render(<NewTripCard onClick={mockOnClick} />);

    await user.click(screen.getByRole("button", { name: /create a new trip/i }));

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("should call onClick when internal button is clicked", async () => {
    const user = userEvent.setup();
    render(<NewTripCard onClick={mockOnClick} />);

    await user.click(screen.getByRole("button", { name: /create new trip/i }));

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("should call onClick when Enter key is pressed", async () => {
    const user = userEvent.setup();
    render(<NewTripCard onClick={mockOnClick} />);

    const card = screen.getByRole("button", { name: /create a new trip/i });
    card.focus();
    await user.keyboard("{Enter}");

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("should call onClick when Space key is pressed", async () => {
    const user = userEvent.setup();
    render(<NewTripCard onClick={mockOnClick} />);

    const card = screen.getByRole("button", { name: /create a new trip/i });
    card.focus();
    await user.keyboard(" ");

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("should not call onClick for other keys", async () => {
    const user = userEvent.setup();
    render(<NewTripCard onClick={mockOnClick} />);

    const card = screen.getByRole("button", { name: /create a new trip/i });
    card.focus();
    await user.keyboard("{Escape}");

    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it("should have proper accessibility attributes", () => {
    render(<NewTripCard onClick={mockOnClick} />);

    const card = screen.getByRole("button", { name: /create a new trip/i });
    expect(card).toHaveAttribute("tabIndex", "0");
    expect(card).toHaveAttribute("aria-label", "Create a new trip");
  });

  it("should display the new trip card image", () => {
    render(<NewTripCard onClick={mockOnClick} />);

    const image = screen.getByAltText("");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src");
  });
});
