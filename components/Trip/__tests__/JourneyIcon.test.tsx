import { render } from "@testing-library/react";

import { JourneyIcon } from "../JourneyIcon";

// Mock Lucide icons
jest.mock("lucide-react", () => {
  const MockIcon = ({ className, size }: { className?: string; size?: number }) => (
    <svg data-testid="mock-icon" className={className} width={size} height={size} />
  );

  return {
    __esModule: true,
    HelpCircle: MockIcon,
    Car: MockIcon,
    Plane: MockIcon,
    TrainFront: MockIcon,
    Bus: MockIcon,
    Ship: MockIcon,
    Footprints: MockIcon,
    Bike: MockIcon,
    TramFront: MockIcon,
    CarTaxiFront: MockIcon,
    Luggage: MockIcon,
  };
});

describe("JourneyIcon", () => {
  it("renders with default size", () => {
    const { container } = render(<JourneyIcon mode="car" />);
    const icon = container.querySelector('[data-testid="mock-icon"]');
    expect(icon).toHaveAttribute("width", "24");
    expect(icon).toHaveAttribute("height", "24");
  });

  it("renders with custom numeric size", () => {
    const { container } = render(<JourneyIcon mode="flight" size={32} />);
    const icon = container.querySelector('[data-testid="mock-icon"]');
    expect(icon).toHaveAttribute("width", "32");
    expect(icon).toHaveAttribute("height", "32");
  });

  it('renders with "sm" string size', () => {
    const { container } = render(<JourneyIcon mode="train" size="sm" />);
    const icon = container.querySelector('[data-testid="mock-icon"]');
    expect(icon).toHaveAttribute("width", "16");
    expect(icon).toHaveAttribute("height", "16");
  });

  it('renders with "lg" string size', () => {
    const { container } = render(<JourneyIcon mode="bus" size="lg" />);
    const icon = container.querySelector('[data-testid="mock-icon"]');
    expect(icon).toHaveAttribute("width", "24");
    expect(icon).toHaveAttribute("height", "24");
  });

  it("applies custom className", () => {
    const { container } = render(<JourneyIcon mode="boat" className="custom-class" />);
    const icon = container.querySelector('[data-testid="mock-icon"]');
    expect(icon).toHaveClass("custom-class");
  });

  it("renders for all journey modes", () => {
    const modes = [
      "flight",
      "train",
      "bus",
      "car",
      "boat",
      "walk",
      "bike",
      "metro",
      "ferry",
      "taxi",
      "other",
    ] as const;

    modes.forEach((mode) => {
      const { container } = render(<JourneyIcon mode={mode} />);
      const icon = container.querySelector('[data-testid="mock-icon"]');
      expect(icon).toBeInTheDocument();
    });
  });

  it("renders default size for large string value", () => {
    const { container } = render(<JourneyIcon mode="walk" size="lg" />);
    const icon = container.querySelector('[data-testid="mock-icon"]');
    expect(icon).toHaveAttribute("width", "24");
    expect(icon).toHaveAttribute("height", "24");
  });

  it("renders small size for sm string value", () => {
    const { container } = render(<JourneyIcon mode="bike" size="sm" />);
    const icon = container.querySelector('[data-testid="mock-icon"]');
    expect(icon).toHaveAttribute("width", "16");
    expect(icon).toHaveAttribute("height", "16");
  });

  it("renders without className when not provided", () => {
    const { container } = render(<JourneyIcon mode="metro" />);
    const icon = container.querySelector('[data-testid="mock-icon"]');
    // When no className is provided, the component should not add a class attribute
    const classAttribute = icon?.getAttribute("class");
    expect(classAttribute === null || classAttribute === "").toBe(true);
  });

  it("renders with empty className when provided as empty string", () => {
    const { container } = render(<JourneyIcon mode="ferry" className="" />);
    const icon = container.querySelector('[data-testid="mock-icon"]');
    // Check that className prop is properly passed (even if empty)
    expect(icon).toHaveAttribute("class", "");
  });
});
