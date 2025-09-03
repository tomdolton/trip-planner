import { render, screen } from "@testing-library/react";

import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from "../card";

describe("Card Components", () => {
  describe("Card", () => {
    it("renders with default classes", () => {
      render(<Card data-testid="card">Card content</Card>);

      const card = screen.getByTestId("card");
      expect(card).toBeInTheDocument();
      expect(card).toHaveAttribute("data-slot", "card");
      expect(card).toHaveClass(
        "bg-card",
        "text-card-foreground",
        "flex",
        "flex-col",
        "gap-6",
        "rounded-lg",
        "border"
      );
    });

    it("applies custom className", () => {
      render(
        <Card data-testid="card" className="custom-class">
          Card content
        </Card>
      );

      expect(screen.getByTestId("card")).toHaveClass("custom-class");
    });

    it("forwards props to div element", () => {
      render(
        <Card data-testid="card" aria-label="Test card">
          Card content
        </Card>
      );

      expect(screen.getByTestId("card")).toHaveAttribute("aria-label", "Test card");
    });
  });

  describe("CardHeader", () => {
    it("renders with default classes", () => {
      render(<CardHeader data-testid="header">Header content</CardHeader>);

      const header = screen.getByTestId("header");
      expect(header).toBeInTheDocument();
      expect(header).toHaveAttribute("data-slot", "card-header");
      expect(header).toHaveClass(
        "@container/card-header",
        "grid",
        "auto-rows-min",
        "grid-rows-[auto_auto]",
        "items-start",
        "gap-1.5"
      );
    });

    it("applies custom className", () => {
      render(
        <CardHeader data-testid="header" className="custom-header">
          Header content
        </CardHeader>
      );

      expect(screen.getByTestId("header")).toHaveClass("custom-header");
    });
  });

  describe("CardTitle", () => {
    it("renders with default classes", () => {
      render(<CardTitle data-testid="title">Title content</CardTitle>);

      const title = screen.getByTestId("title");
      expect(title).toBeInTheDocument();
      expect(title).toHaveAttribute("data-slot", "card-title");
      expect(title).toHaveClass("leading-none", "font-semibold");
    });

    it("applies custom className", () => {
      render(
        <CardTitle data-testid="title" className="custom-title">
          Title content
        </CardTitle>
      );

      expect(screen.getByTestId("title")).toHaveClass("custom-title");
    });
  });

  describe("CardDescription", () => {
    it("renders with default classes", () => {
      render(<CardDescription data-testid="description">Description content</CardDescription>);

      const description = screen.getByTestId("description");
      expect(description).toBeInTheDocument();
      expect(description).toHaveAttribute("data-slot", "card-description");
      expect(description).toHaveClass("text-muted-foreground", "text-sm");
    });

    it("applies custom className", () => {
      render(
        <CardDescription data-testid="description" className="custom-description">
          Description content
        </CardDescription>
      );

      expect(screen.getByTestId("description")).toHaveClass("custom-description");
    });
  });

  describe("CardAction", () => {
    it("renders with default classes", () => {
      render(<CardAction data-testid="action">Action content</CardAction>);

      const action = screen.getByTestId("action");
      expect(action).toBeInTheDocument();
      expect(action).toHaveAttribute("data-slot", "card-action");
      expect(action).toHaveClass(
        "col-start-2",
        "row-span-2",
        "row-start-1",
        "self-start",
        "justify-self-end"
      );
    });

    it("applies custom className", () => {
      render(
        <CardAction data-testid="action" className="custom-action">
          Action content
        </CardAction>
      );

      expect(screen.getByTestId("action")).toHaveClass("custom-action");
    });
  });

  describe("CardContent", () => {
    it("renders with data-slot attribute", () => {
      render(<CardContent data-testid="content">Content goes here</CardContent>);

      const content = screen.getByTestId("content");
      expect(content).toBeInTheDocument();
      expect(content).toHaveAttribute("data-slot", "card-content");
    });

    it("applies custom className", () => {
      render(
        <CardContent data-testid="content" className="custom-content">
          Content goes here
        </CardContent>
      );

      expect(screen.getByTestId("content")).toHaveClass("custom-content");
    });

    it("does not apply default className", () => {
      render(<CardContent data-testid="content">Content goes here</CardContent>);

      // CardContent should not have any default classes beyond what's passed
      const content = screen.getByTestId("content");
      expect(content).not.toHaveClass("p-4"); // Common card content padding class
    });
  });

  describe("CardFooter", () => {
    it("renders with default classes", () => {
      render(<CardFooter data-testid="footer">Footer content</CardFooter>);

      const footer = screen.getByTestId("footer");
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveAttribute("data-slot", "card-footer");
      expect(footer).toHaveClass("flex", "items-center");
    });

    it("applies custom className", () => {
      render(
        <CardFooter data-testid="footer" className="custom-footer">
          Footer content
        </CardFooter>
      );

      expect(screen.getByTestId("footer")).toHaveClass("custom-footer");
    });
  });

  describe("Complete Card Structure", () => {
    it("renders all components together", () => {
      render(
        <Card data-testid="complete-card">
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
            <CardDescription>Test Description</CardDescription>
            <CardAction>
              <button>Action</button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p>Card content</p>
          </CardContent>
          <CardFooter>
            <span>Footer text</span>
          </CardFooter>
        </Card>
      );

      expect(screen.getByTestId("complete-card")).toBeInTheDocument();
      expect(screen.getByText("Test Title")).toBeInTheDocument();
      expect(screen.getByText("Test Description")).toBeInTheDocument();
      expect(screen.getByText("Action")).toBeInTheDocument();
      expect(screen.getByText("Card content")).toBeInTheDocument();
      expect(screen.getByText("Footer text")).toBeInTheDocument();
    });
  });
});
