import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "../dropdown-menu";

describe("DropdownMenu Components", () => {
  describe("Basic DropdownMenu", () => {
    it("renders dropdown menu with trigger and content", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger data-testid="trigger">Open menu</DropdownMenuTrigger>
          <DropdownMenuContent data-testid="content">
            <DropdownMenuItem data-testid="item">Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const trigger = screen.getByTestId("trigger");
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveAttribute("data-slot", "dropdown-menu-trigger");

      // Content should not be visible initially
      expect(screen.queryByTestId("content")).not.toBeInTheDocument();

      // Click trigger to open menu
      await user.click(trigger);

      const content = screen.getByTestId("content");
      expect(content).toBeInTheDocument();
      expect(content).toHaveAttribute("data-slot", "dropdown-menu-content");
    });

    it("applies custom className to content", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent className="custom-content">
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText("Open menu"));
      const content = screen.getByText("Item 1").closest('[data-slot="dropdown-menu-content"]');
      expect(content).toHaveClass("custom-content");
    });
  });

  describe("DropdownMenuItem", () => {
    it("renders with default variant", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem data-testid="item">Default Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText("Open menu"));
      const item = screen.getByTestId("item");
      expect(item).toHaveAttribute("data-slot", "dropdown-menu-item");
      expect(item).toHaveAttribute("data-variant", "default");
    });

    it("renders with destructive variant", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem data-testid="item" variant="destructive">
              Delete Item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText("Open menu"));
      const item = screen.getByTestId("item");
      expect(item).toHaveAttribute("data-variant", "destructive");
    });

    it("renders with inset prop", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem data-testid="item" inset>
              Inset Item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText("Open menu"));
      const item = screen.getByTestId("item");
      expect(item).toHaveAttribute("data-inset", "true");
    });

    it("calls onClick when clicked", async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleClick}>Clickable Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText("Open menu"));
      await user.click(screen.getByText("Clickable Item"));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("DropdownMenuLabel", () => {
    it("renders with default classes", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel data-testid="label">Menu Label</DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText("Open menu"));
      const label = screen.getByTestId("label");
      expect(label).toHaveAttribute("data-slot", "dropdown-menu-label");
    });

    it("renders with inset prop", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel data-testid="label" inset>
              Inset Label
            </DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText("Open menu"));
      const label = screen.getByTestId("label");
      expect(label).toHaveAttribute("data-inset", "true");
    });
  });

  describe("DropdownMenuSeparator", () => {
    it("renders separator", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSeparator data-testid="separator" />
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText("Open menu"));
      const separator = screen.getByTestId("separator");
      expect(separator).toHaveAttribute("data-slot", "dropdown-menu-separator");
    });
  });

  describe("DropdownMenuShortcut", () => {
    it("renders shortcut", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              Item with shortcut
              <DropdownMenuShortcut data-testid="shortcut">⌘K</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText("Open menu"));
      const shortcut = screen.getByTestId("shortcut");
      expect(shortcut).toHaveAttribute("data-slot", "dropdown-menu-shortcut");
      expect(shortcut).toHaveTextContent("⌘K");
    });
  });

  describe("DropdownMenuCheckboxItem", () => {
    it("renders checkbox item", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem data-testid="checkbox" checked={true}>
              Checked Item
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText("Open menu"));
      const checkbox = screen.getByTestId("checkbox");
      expect(checkbox).toHaveAttribute("data-slot", "dropdown-menu-checkbox-item");
    });
  });

  describe("DropdownMenuRadioGroup and DropdownMenuRadioItem", () => {
    it("renders radio group with radio items", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value="option1">
              <DropdownMenuRadioItem data-testid="radio1" value="option1">
                Option 1
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem data-testid="radio2" value="option2">
                Option 2
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText("Open menu"));
      const radio1 = screen.getByTestId("radio1");
      const radio2 = screen.getByTestId("radio2");

      expect(radio1).toHaveAttribute("data-slot", "dropdown-menu-radio-item");
      expect(radio2).toHaveAttribute("data-slot", "dropdown-menu-radio-item");
    });
  });

  describe("DropdownMenuGroup", () => {
    it("renders group", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup data-testid="group">
              <DropdownMenuItem>Group Item 1</DropdownMenuItem>
              <DropdownMenuItem>Group Item 2</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText("Open menu"));
      const group = screen.getByTestId("group");
      expect(group).toHaveAttribute("data-slot", "dropdown-menu-group");
    });
  });

  describe("DropdownMenuSub", () => {
    it("renders submenu", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger data-testid="sub-trigger">Submenu</DropdownMenuSubTrigger>
              <DropdownMenuSubContent data-testid="sub-content">
                <DropdownMenuItem>Sub Item</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText("Open menu"));
      const subTrigger = screen.getByTestId("sub-trigger");
      expect(subTrigger).toHaveAttribute("data-slot", "dropdown-menu-sub-trigger");
    });

    it("renders sub trigger with inset", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger data-testid="sub-trigger" inset>
                Inset Submenu
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Sub Item</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText("Open menu"));
      const subTrigger = screen.getByTestId("sub-trigger");
      expect(subTrigger).toHaveAttribute("data-inset", "true");
    });
  });

  describe("Complete Menu Structure", () => {
    it("renders a complex menu structure", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Complex Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked>Show Notifications</DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText("Complex Menu"));

      expect(screen.getByText("My Account")).toBeInTheDocument();
      expect(screen.getByText("Profile")).toBeInTheDocument();
      expect(screen.getByText("Settings")).toBeInTheDocument();
      expect(screen.getByText("Show Notifications")).toBeInTheDocument();
      expect(screen.getByText("Sign Out")).toBeInTheDocument();
    });
  });
});
