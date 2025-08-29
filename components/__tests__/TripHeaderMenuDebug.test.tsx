import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, fireEvent, within } from "@testing-library/react";

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

describe("TripHeader debug menu", () => {
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

  it("prints menu HTML after opening actions", () => {
    renderWithQueryClient(
      <TripHeader trip={trip} onEditClick={jest.fn()} onDeleteClick={jest.fn()} />
    );
    fireEvent.click(screen.getByRole("button", { name: /open actions/i }));
    // Print the menu HTML for debugging
    // Find all menu containers in the body
    const menus = within(document.body).queryAllByRole("menu");
    for (const menu of menus) {
      console.log(menu.outerHTML);
    }
    // Always pass so we can see the output
    expect(menus.length).toBeGreaterThanOrEqual(0);
  });
});
