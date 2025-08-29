import { render, screen, fireEvent } from "@testing-library/react";

import { TripsFilterTabs } from "../TripsDashboard/TripsFilterTabs";

describe("TripsFilterTabs", () => {
  const onChange = jest.fn();

  afterEach(() => {
    onChange.mockClear();
  });

  it("renders all filter buttons", () => {
    render(<TripsFilterTabs value="upcoming" onChange={onChange} />);
    expect(screen.getByRole("button", { name: /Upcoming Trips/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Past Trips/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /All Trips/i })).toBeInTheDocument();
  });

  it("highlights the selected filter", () => {
    render(<TripsFilterTabs value="past" onChange={onChange} />);
    const pastBtn = screen.getByRole("button", { name: /Past Trips/i });
    expect(pastBtn).toHaveAttribute("aria-pressed", "true");
    expect(pastBtn).toHaveClass("font-semibold");
  });

  it("calls onChange with correct value when a tab is clicked", () => {
    render(<TripsFilterTabs value="upcoming" onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: /Past Trips/i }));
    expect(onChange).toHaveBeenCalledWith("past");
  });
});
