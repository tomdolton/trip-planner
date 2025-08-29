import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Trip } from "@/types/trip";

import { TripHeader } from "../Trip/TripHeader";
// Mock supabase client to avoid env var errors
jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: () => ({ select: () => ({ data: [], error: null }) }),
    auth: { signOut: jest.fn() },
  },
}));

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient();
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

// Helper to wait for the Radix dropdown menu to open
async function waitForMenuOpen(): Promise<HTMLElement> {
  for (let i = 0; i < 10; i++) {
    const menu = document.body.querySelector(
      '[data-slot="dropdown-menu-content"][data-state="open"]'
    ) as HTMLElement | null;
    if (menu) return menu;
    await new Promise((res) => setTimeout(res, 50));
  }
  throw new Error("Dropdown menu did not open");
}

// Helper to find a menu item by text robustly
async function findMenuItem(menu: HTMLElement, label: RegExp): Promise<HTMLElement> {
  try {
    return await within(menu).findByRole("menuitem", { name: label });
  } catch {
    const el = Array.from(menu.querySelectorAll('[data-slot="dropdown-menu-item"]')).find(
      (el) => el.textContent && label.test(el.textContent)
    ) as HTMLElement | undefined;
    if (!el) throw new Error(`Menu item not found: ${label}`);
    return el;
  }
}

describe("TripHeader", () => {
  const trip: Trip = {
    id: "trip1",
    title: "Test Trip",
    start_date: "2099-08-01",
    end_date: "2099-08-10",
    description: "Trip notes",
    created_at: "2099-07-01",
    updated_at: "2099-07-02",
    trip_phases: [],
  };

  it("renders trip details and action menu", () => {
    renderWithQueryClient(
      <TripHeader trip={trip} onEditClick={jest.fn()} onDeleteClick={jest.fn()} />
    );
    expect(screen.getByText(/test trip/i)).toBeInTheDocument();
    expect(screen.getByText(/trip notes/i)).toBeInTheDocument();
    // Action menu trigger should be present
    expect(screen.getByRole("button", { name: /open actions/i })).toBeInTheDocument();
  });

  it("calls onEditClick when Edit is selected", async () => {
    const onEditClick = jest.fn();
    renderWithQueryClient(
      <TripHeader trip={trip} onEditClick={onEditClick} onDeleteClick={jest.fn()} />
    );
    await userEvent.click(screen.getByRole("button", { name: /open actions/i }));
    const menu = await waitForMenuOpen();
    const editItem = await findMenuItem(menu, /edit/i);
    await userEvent.click(editItem);
    expect(onEditClick).toHaveBeenCalled();
  });

  it("calls onDeleteClick when Delete is selected", async () => {
    const onDeleteClick = jest.fn();
    renderWithQueryClient(
      <TripHeader trip={trip} onEditClick={jest.fn()} onDeleteClick={onDeleteClick} />
    );
    await userEvent.click(screen.getByRole("button", { name: /open actions/i }));
    const menu = await waitForMenuOpen();
    const deleteItem = await findMenuItem(menu, /delete/i);
    await userEvent.click(deleteItem);
    expect(onDeleteClick).toHaveBeenCalled();
  });

  it("shows AddTripPhaseDialog and AddLocationDialog when triggered", async () => {
    renderWithQueryClient(
      <TripHeader trip={trip} onEditClick={jest.fn()} onDeleteClick={jest.fn()} />
    );
    // Open Add Phase dialog
    await userEvent.click(screen.getAllByRole("button", { name: /phase/i })[0]);
    const phaseDialog = await within(document.body).findByRole("dialog");
    expect(within(phaseDialog).getByRole("heading", { name: /add.*phase/i })).toBeInTheDocument();
    // Close the dialog (click Cancel)
    await userEvent.click(within(phaseDialog).getByRole("button", { name: /cancel/i }));
    // Open Add Location dialog
    await userEvent.click(screen.getAllByRole("button", { name: /location/i })[0]);
    const locationDialog = await within(document.body).findByRole("dialog");
    expect(
      within(locationDialog).getByRole("heading", { name: /add.*location/i })
    ).toBeInTheDocument();
  });
});
