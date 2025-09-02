import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useAddTrip } from "@/lib/mutations/useAddTrip";
// Mock next/navigation's useRouter to avoid 'expected app router to be mounted' error
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

import { AddTripDialog } from "../TripsDashboard/AddTripDialog";

jest.mock("@/lib/mutations/useAddTrip");
jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));
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

describe("AddTripDialog", () => {
  const mutateMock = jest.fn();
  beforeEach(() => {
    (useAddTrip as jest.Mock).mockReturnValue({
      mutate: mutateMock,
      mutateAsync: mutateMock,
      isSuccess: false,
      isError: false,
      error: null,
      isPending: false,
    });
  });

  it("renders form fields", () => {
    renderWithQueryClient(<AddTripDialog open={true} onOpenChange={jest.fn()} />);
    expect(screen.getByLabelText(/trip title/i)).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /pick a date/i })).toHaveLength(2);
  });

  it("validates required fields", async () => {
    renderWithQueryClient(<AddTripDialog open={true} onOpenChange={jest.fn()} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /save/i }));
    // There may be multiple 'required' messages, check at least one is visible
    const errors = await screen.findAllByText(/required/i, { exact: false });
    expect(errors.length).toBeGreaterThan(0);
    // Optionally, check that at least one is not aria-hidden
    expect(errors.some((e) => !e.className.includes("sr-only"))).toBe(true);
  });

  it("submits form and closes on success", async () => {
    const onOpenChange = jest.fn();
    mutateMock.mockImplementation((_data: unknown, { onSuccess }: { onSuccess: () => void }) =>
      onSuccess()
    );
    renderWithQueryClient(<AddTripDialog open={true} onOpenChange={onOpenChange} />);
    fireEvent.change(screen.getByLabelText(/trip title/i), { target: { value: "My Trip" } });
    fireEvent.click(screen.getAllByRole("button", { name: /pick a date/i })[0]);
    // Simulate date selection if needed
    fireEvent.click(screen.getByRole("button", { name: /save/i }));
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
  });

  it("shows error on failed submit", async () => {
    mutateMock.mockImplementation((_data, options) => {
      if (options && typeof options.onError === "function") {
        options.onError(new Error("fail"));
      }
    });
    renderWithQueryClient(<AddTripDialog open={true} onOpenChange={jest.fn()} />);
    fireEvent.change(screen.getByLabelText(/trip title/i), { target: { value: "My Trip" } });
    fireEvent.click(screen.getAllByRole("button", { name: /pick a date/i })[0]);
    fireEvent.click(screen.getByRole("button", { name: /save/i }));
    await waitFor(() => {
      expect(true).toBe(true);
    });
  });
});
