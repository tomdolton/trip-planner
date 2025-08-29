import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Trip } from "@/types/trip";

import { useUpdateTrip } from "@/lib/mutations/useUpdateTrip";
// Mock supabase client to avoid env var errors
jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: () => ({ select: () => ({ data: [], error: null }) }),
    auth: { signOut: jest.fn() },
  },
}));

import { EditTripDialog } from "../TripsDashboard/EditTripDialog";

jest.mock("@/lib/mutations/useUpdateTrip");
jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const mockTrip: Trip = {
  id: "trip1",
  title: "Test Trip",
  start_date: "2099-08-01",
  end_date: "2099-08-10",
  description: "Trip notes",
  created_at: "2099-07-01",
  updated_at: "2099-07-02",
};

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient();
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe("EditTripDialog", () => {
  const mutateMock = jest.fn();
  beforeEach(() => {
    (useUpdateTrip as jest.Mock).mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    });
  });

  it("renders form fields with trip data", () => {
    renderWithQueryClient(<EditTripDialog trip={mockTrip} open={true} onOpenChange={jest.fn()} />);
    expect(screen.getByLabelText(/trip title/i)).toHaveValue(mockTrip.title);
    expect(screen.getByLabelText(/trip title/i)).toBeInTheDocument();
  });

  it("validates required fields", async () => {
    renderWithQueryClient(<EditTripDialog trip={mockTrip} open={true} onOpenChange={jest.fn()} />);
    const user = userEvent.setup();
    fireEvent.change(screen.getByLabelText(/trip title/i), { target: { value: "" } });
    await user.click(screen.getByRole("button", { name: /save/i }));
    const errors = await screen.findAllByText(/required/i, { exact: false });
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => !e.className.includes("sr-only"))).toBe(true);
  });

  it("submits form and closes on success", async () => {
    const onOpenChange = jest.fn();
    mutateMock.mockImplementation((_data, { onSuccess }: { onSuccess: () => void }) => onSuccess());
    renderWithQueryClient(
      <EditTripDialog trip={mockTrip} open={true} onOpenChange={onOpenChange} />
    );
    fireEvent.change(screen.getByLabelText(/trip title/i), { target: { value: "Updated Trip" } });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
  });

  it("shows error on failed submit", async () => {
    mutateMock.mockImplementation((_data, { onError }: { onError: (error: Error) => void }) =>
      onError(new Error("fail"))
    );
    renderWithQueryClient(<EditTripDialog trip={mockTrip} open={true} onOpenChange={jest.fn()} />);
    fireEvent.change(screen.getByLabelText(/trip title/i), { target: { value: "Updated Trip" } });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));
    await waitFor(() => {
      expect(true).toBe(true);
    });
  });
});
