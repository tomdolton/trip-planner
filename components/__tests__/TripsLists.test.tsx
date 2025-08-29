import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useDeleteTrip } from "@/lib/mutations/useDeleteTrip";
import { useTrips } from "@/lib/queries/useTrips";

import TripsList from "../TripsDashboard/TripsList";

jest.mock("@/lib/queries/useTrips");
jest.mock("@/lib/mutations/useDeleteTrip");
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  }),
}));
jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: () => ({
      select: () => ({ data: [], error: null }),
    }),
    auth: {
      signOut: jest.fn(),
      getUser: jest.fn(() => Promise.resolve({ data: { user: { id: "test-user-id" } } })),
      onAuthStateChange: jest.fn(() => ({
        data: {
          subscription: { unsubscribe: jest.fn() },
        },
      })),
    },
  },
}));

const mockTrips = [
  {
    id: "trip1",
    title: "Test Trip",
    start_date: "2099-08-01",
    end_date: "2099-08-10",
    description: "Trip notes",
  },
];

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient();
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe("TripsList", () => {
  const mutateMock = jest.fn();

  beforeEach(() => {
    (useDeleteTrip as jest.Mock).mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    });
  });

  it("renders trip and calls delete mutation on confirm", async () => {
    (useTrips as jest.Mock).mockReturnValue({
      data: mockTrips,
      isLoading: false,
      isError: false,
    });
    renderWithQueryClient(<TripsList />);
    const user = userEvent.setup();
    const menuButton = screen.getByRole("button", { name: /open actions/i });
    await user.click(menuButton);
    const deleteMenuItem = await screen.findByText(/delete/i);
    await user.click(deleteMenuItem);
    const confirmButton = await screen.findByRole("button", { name: /yes, delete/i });
    await user.click(confirmButton);
    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalledWith("trip1", expect.any(Object));
    });
  });

  it("shows loading skeletons when loading", () => {
    (useTrips as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });
    renderWithQueryClient(<TripsList />);
    expect(screen.getAllByRole("status").length).toBeGreaterThan(0); // Skeletons
  });

  it("shows error message when error", () => {
    (useTrips as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });
    renderWithQueryClient(<TripsList />);
    expect(screen.getByText(/failed to load trips/i)).toBeInTheDocument();
  });

  it("shows empty state when no trips", () => {
    (useTrips as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });
    renderWithQueryClient(<TripsList />);
    expect(screen.getByText(/no trips found/i)).toBeInTheDocument();
  });

  it("opens edit dialog when edit is clicked", async () => {
    (useTrips as jest.Mock).mockReturnValue({
      data: mockTrips,
      isLoading: false,
      isError: false,
    });
    renderWithQueryClient(<TripsList />);
    const user = userEvent.setup();
    const menuButton = screen.getByRole("button", { name: /open actions/i });
    await user.click(menuButton);
    const editMenuItem = await screen.findByText(/edit/i);
    await user.click(editMenuItem);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
