import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CreateNewDropdown } from "../CreateNewDropdown";

describe("CreateNewDropdown", () => {
  const mockOnAddPhase = jest.fn();
  const mockOnAddLocation = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Mobile view", () => {
    it("renders two buttons on mobile", () => {
      render(<CreateNewDropdown onAddPhase={mockOnAddPhase} onAddLocation={mockOnAddLocation} />);

      // Mobile buttons should be visible (though hidden by CSS media queries)
      const phaseButton = screen.getByRole("button", { name: /phase/i });
      const locationButton = screen.getByRole("button", { name: /location/i });

      expect(phaseButton).toBeInTheDocument();
      expect(locationButton).toBeInTheDocument();
    });

    it("calls onAddPhase when phase button clicked", async () => {
      const user = userEvent.setup();
      render(<CreateNewDropdown onAddPhase={mockOnAddPhase} onAddLocation={mockOnAddLocation} />);

      const phaseButton = screen.getByRole("button", { name: /phase/i });
      await user.click(phaseButton);

      expect(mockOnAddPhase).toHaveBeenCalledTimes(1);
    });

    it("calls onAddLocation when location button clicked", async () => {
      const user = userEvent.setup();
      render(<CreateNewDropdown onAddPhase={mockOnAddPhase} onAddLocation={mockOnAddLocation} />);

      const locationButton = screen.getByRole("button", { name: /location/i });
      await user.click(locationButton);

      expect(mockOnAddLocation).toHaveBeenCalledTimes(1);
    });
  });

  describe("Desktop view", () => {
    it("renders dropdown trigger button", () => {
      render(<CreateNewDropdown onAddPhase={mockOnAddPhase} onAddLocation={mockOnAddLocation} />);

      const dropdownButton = screen.getByRole("button", { name: /create new/i });
      expect(dropdownButton).toBeInTheDocument();
    });

    it("renders dropdown with custom button label", () => {
      render(
        <CreateNewDropdown
          onAddPhase={mockOnAddPhase}
          onAddLocation={mockOnAddLocation}
          buttonLabel="Add New Item"
        />
      );

      const dropdownButton = screen.getByRole("button", { name: /add new item/i });
      expect(dropdownButton).toBeInTheDocument();
    });

    it("opens dropdown menu when clicked", async () => {
      const user = userEvent.setup();
      render(<CreateNewDropdown onAddPhase={mockOnAddPhase} onAddLocation={mockOnAddLocation} />);

      const dropdownButton = screen.getByRole("button", { name: /create new/i });
      await user.click(dropdownButton);

      // Use more specific selectors to avoid conflicts between mobile and desktop views
      await waitFor(() => {
        expect(screen.getByRole("menuitem", { name: "Phase" })).toBeInTheDocument();
        expect(screen.getByRole("menuitem", { name: "Location" })).toBeInTheDocument();
      });
    });

    it("calls onAddPhase when phase menu item clicked", async () => {
      const user = userEvent.setup();
      render(<CreateNewDropdown onAddPhase={mockOnAddPhase} onAddLocation={mockOnAddLocation} />);

      const dropdownButton = screen.getByRole("button", { name: /create new/i });
      await user.click(dropdownButton);

      const phaseMenuItem = screen.getByRole("menuitem", { name: /phase/i });
      await user.click(phaseMenuItem);

      expect(mockOnAddPhase).toHaveBeenCalledTimes(1);
    });

    it("calls onAddLocation when location menu item clicked", async () => {
      const user = userEvent.setup();
      render(<CreateNewDropdown onAddPhase={mockOnAddPhase} onAddLocation={mockOnAddLocation} />);

      const dropdownButton = screen.getByRole("button", { name: /create new/i });
      await user.click(dropdownButton);

      const locationMenuItem = screen.getByRole("menuitem", { name: /location/i });
      await user.click(locationMenuItem);

      expect(mockOnAddLocation).toHaveBeenCalledTimes(1);
    });
  });

  describe("Props", () => {
    it("applies custom className", () => {
      const { container } = render(
        <CreateNewDropdown
          onAddPhase={mockOnAddPhase}
          onAddLocation={mockOnAddLocation}
          className="custom-class"
        />
      );

      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("passes custom buttonProps to dropdown trigger", () => {
      render(
        <CreateNewDropdown
          onAddPhase={mockOnAddPhase}
          onAddLocation={mockOnAddLocation}
          buttonProps={{ variant: "outline", disabled: true }}
        />
      );

      const dropdownButton = screen.getByRole("button", { name: /create new/i });
      expect(dropdownButton).toBeDisabled();
    });

    it("renders with default props", () => {
      render(<CreateNewDropdown onAddPhase={mockOnAddPhase} onAddLocation={mockOnAddLocation} />);

      const dropdownButton = screen.getByRole("button", { name: /create new/i });
      expect(dropdownButton).toBeInTheDocument();
    });
  });

  describe("Icons", () => {
    it("renders Plus icons in mobile buttons", () => {
      render(<CreateNewDropdown onAddPhase={mockOnAddPhase} onAddLocation={mockOnAddLocation} />);

      // Check that icons are present in the mobile buttons
      const phaseButton = screen.getByRole("button", { name: "Phase" });
      const locationButton = screen.getByRole("button", { name: "Location" });

      expect(phaseButton).toBeInTheDocument();
      expect(locationButton).toBeInTheDocument();

      // Verify that the buttons contain SVG icons
      const phaseSvg = phaseButton.querySelector("svg");
      const locationSvg = locationButton.querySelector("svg");

      expect(phaseSvg).toBeInTheDocument();
      expect(locationSvg).toBeInTheDocument();
    });

    it("renders FolderPlus and MapPin icons in dropdown menu", async () => {
      const user = userEvent.setup();
      render(<CreateNewDropdown onAddPhase={mockOnAddPhase} onAddLocation={mockOnAddLocation} />);

      const dropdownButton = screen.getByRole("button", { name: /create new/i });
      await user.click(dropdownButton);

      // Check that SVG icons are present in the dropdown menu items
      await waitFor(() => {
        const phaseMenuItem = screen.getByRole("menuitem", { name: "Phase" });
        const locationMenuItem = screen.getByRole("menuitem", { name: "Location" });

        // Verify that the menu items contain SVG elements
        expect(phaseMenuItem.querySelector("svg")).toBeInTheDocument();
        expect(locationMenuItem.querySelector("svg")).toBeInTheDocument();
      });
    });
  });
});
