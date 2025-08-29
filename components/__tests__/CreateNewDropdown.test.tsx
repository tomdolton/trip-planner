import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CreateNewDropdown } from "../Trip/CreateNewDropdown";

describe("CreateNewDropdown", () => {
  it("renders mobile and desktop buttons", () => {
    render(<CreateNewDropdown onAddPhase={jest.fn()} onAddLocation={jest.fn()} />);
    // Mobile buttons
    expect(screen.getAllByRole("button", { name: /phase|location/i })).toHaveLength(2);
    // Desktop dropdown trigger
    expect(screen.getByRole("button", { name: /create new/i })).toBeInTheDocument();
  });

  it("calls onAddPhase when mobile Phase button clicked", async () => {
    const onAddPhase = jest.fn();
    render(<CreateNewDropdown onAddPhase={onAddPhase} onAddLocation={jest.fn()} />);
    const phaseBtn = screen.getAllByRole("button", { name: /phase/i })[0];
    await userEvent.click(phaseBtn);
    expect(onAddPhase).toHaveBeenCalled();
  });

  it("calls onAddLocation when mobile Location button clicked", async () => {
    const onAddLocation = jest.fn();
    render(<CreateNewDropdown onAddPhase={jest.fn()} onAddLocation={onAddLocation} />);
    const locationBtn = screen.getAllByRole("button", { name: /location/i })[0];
    await userEvent.click(locationBtn);
    expect(onAddLocation).toHaveBeenCalled();
  });

  it("calls onAddPhase when desktop dropdown Phase selected", async () => {
    const onAddPhase = jest.fn();
    render(<CreateNewDropdown onAddPhase={onAddPhase} onAddLocation={jest.fn()} />);
    // Open dropdown
    fireEvent.click(screen.getByRole("button", { name: /create new/i }));
    // Find dropdown item
    const phaseItem = await screen.findByText(/phase/i);
    fireEvent.click(phaseItem);
    expect(onAddPhase).toHaveBeenCalled();
  });

  it("calls onAddLocation when desktop dropdown Location selected", async () => {
    const onAddLocation = jest.fn();
    render(<CreateNewDropdown onAddPhase={jest.fn()} onAddLocation={onAddLocation} />);
    // Open dropdown
    fireEvent.click(screen.getByRole("button", { name: /create new/i }));
    // Find dropdown item
    const locationItem = await screen.findByText(/location/i);
    fireEvent.click(locationItem);
    expect(onAddLocation).toHaveBeenCalled();
  });
});
