import { render, screen, fireEvent, waitFor } from "@testing-library/react";

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
    },
  },
}));

const mockTrips = [
  {
    id: "trip1",
    title: "Test Trip",
    start_date: "2025-08-01",
    end_date: "2025-08-10",
    description: "Trip notes",
  },
];

describe("TripsList", () => {
  const mutateMock = jest.fn();

  beforeEach(() => {
    (useTrips as jest.Mock).mockReturnValue({
      data: mockTrips,
      isLoading: false,
      isError: false,
    });

    (useDeleteTrip as jest.Mock).mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    });
  });

  it("renders trip and calls delete mutation on confirm", async () => {
    render(<TripsList />);

    fireEvent.click(screen.getByRole("button", { name: /delete/i }));

    // Wait for alert dialog
    const confirmButton = await screen.findByRole("button", { name: /yes, delete/i });

    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalledWith("trip1", expect.any(Object));
    });
  });
});
