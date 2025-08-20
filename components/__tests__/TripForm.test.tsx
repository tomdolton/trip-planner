jest.mock("@/lib/mutations/useAddTrip");

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import { useAddTrip } from "@/lib/mutations/useAddTrip";

import { AddTripDialog } from "../TripsDashboard/AddTripDialog";

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));
jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: () => ({
      select: () => ({ data: [], error: null }),
    }),
    auth: {
      signOut: jest.fn(),
    },
  },
}));

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient();
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe("AddTripDialog", () => {
  const mutateMock = jest.fn();

  beforeEach(() => {
    (useAddTrip as jest.Mock).mockReturnValue({
      mutate: mutateMock,
      isSuccess: false,
      isError: false,
      error: null,
      isPending: false,
    });
  });

  it("renders form fields", () => {
    renderWithQueryClient(<AddTripDialog open={true} onOpenChange={jest.fn()} />);
    expect(screen.getByLabelText(/trip title/i)).toBeInTheDocument();
    // DatePicker fields are buttons, not inputs
    expect(screen.getAllByRole("button", { name: /pick a date/i })).toHaveLength(2);
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it("submits valid form", async () => {
    renderWithQueryClient(<AddTripDialog open={true} onOpenChange={jest.fn()} />);

    fireEvent.change(screen.getByLabelText(/trip title/i), { target: { value: "Japan Trip" } });
    // DatePicker fields are buttons, not inputs; skip changing them in this test
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: "Exciting!" } });

    fireEvent.click(screen.getByRole("button", { name: /save trip/i }));

    await waitFor(() =>
      expect(mutateMock).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Japan Trip",
          // start_date and end_date may be empty if not set via DatePicker in test
          description: "Exciting!",
        }),
        expect.any(Object)
      )
    );
  });
});
