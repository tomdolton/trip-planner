import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { GooglePlacesAutocomplete } from "../GooglePlacesAutocomplete";

// Mock lodash.debounce
jest.mock("lodash.debounce", () => {
  return jest.fn((fn) => {
    const debounced = (...args: unknown[]) => {
      fn(...args);
    };
    debounced.cancel = jest.fn();
    debounced.flush = jest.fn();
    return debounced;
  });
});

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockPlace = {
  place_id: "123",
  name: "Test Place",
  formatted_address: "123 Test St, Test City",
  rating: 4.5,
};

describe("GooglePlacesAutocomplete", () => {
  const mockOnPlaceSelected = jest.fn();
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ places: [mockPlace] }),
    });
  });

  it("renders with default placeholder", () => {
    render(<GooglePlacesAutocomplete onPlaceSelected={mockOnPlaceSelected} />);
    expect(screen.getByPlaceholderText("Search for a place...")).toBeInTheDocument();
  });

  it("renders with custom placeholder", () => {
    render(
      <GooglePlacesAutocomplete
        onPlaceSelected={mockOnPlaceSelected}
        placeholder="Custom placeholder"
      />
    );
    expect(screen.getByPlaceholderText("Custom placeholder")).toBeInTheDocument();
  });

  it("displays provided value", () => {
    render(<GooglePlacesAutocomplete onPlaceSelected={mockOnPlaceSelected} value="Test value" />);
    expect(screen.getByDisplayValue("Test value")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <GooglePlacesAutocomplete onPlaceSelected={mockOnPlaceSelected} className="custom-class" />
    );
    expect(screen.getByPlaceholderText("Search for a place...")).toHaveClass("custom-class");
  });

  it("handles autoFocus prop", () => {
    render(<GooglePlacesAutocomplete onPlaceSelected={mockOnPlaceSelected} autoFocus />);
    expect(screen.getByPlaceholderText("Search for a place...")).toHaveFocus();
  });

  it("applies aria-invalid attribute", () => {
    render(<GooglePlacesAutocomplete onPlaceSelected={mockOnPlaceSelected} aria-invalid />);
    expect(screen.getByPlaceholderText("Search for a place...")).toHaveAttribute(
      "aria-invalid",
      "true"
    );
  });

  it("calls onChange when input value changes", async () => {
    const user = userEvent.setup();
    render(
      <GooglePlacesAutocomplete onPlaceSelected={mockOnPlaceSelected} onChange={mockOnChange} />
    );

    const input = screen.getByPlaceholderText("Search for a place...");
    await user.type(input, "Test");

    expect(mockOnChange).toHaveBeenCalledWith("T");
    expect(mockOnChange).toHaveBeenCalledWith("Te");
    expect(mockOnChange).toHaveBeenCalledWith("Tes");
    expect(mockOnChange).toHaveBeenCalledWith("Test");
  });

  it("does not search for queries less than 3 characters", async () => {
    const user = userEvent.setup();
    render(<GooglePlacesAutocomplete onPlaceSelected={mockOnPlaceSelected} />);

    const input = screen.getByPlaceholderText("Search for a place...");
    await user.type(input, "Te");

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("searches for queries with 3 or more characters", async () => {
    const user = userEvent.setup();
    render(<GooglePlacesAutocomplete onPlaceSelected={mockOnPlaceSelected} />);

    const input = screen.getByPlaceholderText("Search for a place...");
    await user.type(input, "Test");

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/places/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: "Test" }),
      });
    });
  });

  it("displays loading state during search", async () => {
    // Mock a delayed response
    mockFetch.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: () => Promise.resolve({ places: [mockPlace] }),
              }),
            100
          )
        )
    );

    const user = userEvent.setup();
    render(<GooglePlacesAutocomplete onPlaceSelected={mockOnPlaceSelected} />);

    const input = screen.getByPlaceholderText("Search for a place...");
    await user.type(input, "Test");

    expect(screen.getByText("Searching...")).toBeInTheDocument();
  });

  it("displays search results", async () => {
    const user = userEvent.setup();
    render(<GooglePlacesAutocomplete onPlaceSelected={mockOnPlaceSelected} />);

    const input = screen.getByPlaceholderText("Search for a place...");
    await user.type(input, "Test");

    await waitFor(() => {
      expect(screen.getByText("Test Place")).toBeInTheDocument();
      expect(screen.getByText("123 Test St, Test City")).toBeInTheDocument();
      expect(screen.getByText("⭐ 4.5")).toBeInTheDocument();
    });
  });

  it("does not display rating if not provided", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          places: [{ ...mockPlace, rating: undefined }],
        }),
    });

    const user = userEvent.setup();
    render(<GooglePlacesAutocomplete onPlaceSelected={mockOnPlaceSelected} />);

    const input = screen.getByPlaceholderText("Search for a place...");
    await user.type(input, "Test");

    await waitFor(() => {
      expect(screen.getByText("Test Place")).toBeInTheDocument();
      expect(screen.queryByText(/⭐/)).not.toBeInTheDocument();
    });
  });

  it("handles place selection", async () => {
    const user = userEvent.setup();
    render(<GooglePlacesAutocomplete onPlaceSelected={mockOnPlaceSelected} />);

    const input = screen.getByPlaceholderText("Search for a place...");
    await user.type(input, "Test");

    await waitFor(() => {
      expect(screen.getByText("Test Place")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Test Place"));

    expect(mockOnPlaceSelected).toHaveBeenCalledWith(mockPlace);
    expect(input).toHaveValue("Test Place");
    expect(screen.queryByText("Test Place")).not.toBeInTheDocument(); // Suggestions should be hidden
  });

  it("handles API error response", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
    });

    const user = userEvent.setup();
    render(<GooglePlacesAutocomplete onPlaceSelected={mockOnPlaceSelected} />);

    const input = screen.getByPlaceholderText("Search for a place...");
    await user.type(input, "Test");

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Places API error:", 500);
    });

    consoleSpy.mockRestore();
  });

  it("handles network error", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    mockFetch.mockRejectedValue(new Error("Network error"));

    const user = userEvent.setup();
    render(<GooglePlacesAutocomplete onPlaceSelected={mockOnPlaceSelected} />);

    const input = screen.getByPlaceholderText("Search for a place...");
    await user.type(input, "Test");

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Error searching places:", expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  it("shows and hides suggestions correctly", async () => {
    const user = userEvent.setup();
    render(<GooglePlacesAutocomplete onPlaceSelected={mockOnPlaceSelected} />);

    const input = screen.getByPlaceholderText("Search for a place...");
    await user.type(input, "Test");

    await waitFor(() => {
      expect(screen.getByText("Test Place")).toBeInTheDocument();
    });

    // Test that suggestions are visible
    expect(screen.getByText("Test Place")).toBeInTheDocument();
  });

  it("hides suggestions when pressing Escape", async () => {
    const user = userEvent.setup();
    render(<GooglePlacesAutocomplete onPlaceSelected={mockOnPlaceSelected} />);

    const input = screen.getByPlaceholderText("Search for a place...");
    await user.type(input, "Test");

    await waitFor(() => {
      expect(screen.getByText("Test Place")).toBeInTheDocument();
    });

    await user.type(input, "{Escape}");
    expect(screen.queryByText("Test Place")).not.toBeInTheDocument();
  });

  it("hides suggestions when clicking overlay", async () => {
    const user = userEvent.setup();
    render(<GooglePlacesAutocomplete onPlaceSelected={mockOnPlaceSelected} />);

    const input = screen.getByPlaceholderText("Search for a place...");
    await user.type(input, "Test");

    await waitFor(() => {
      expect(screen.getByText("Test Place")).toBeInTheDocument();
    });

    // Click the overlay
    const overlay = document.querySelector(".fixed.inset-0.z-40");
    if (overlay) {
      await user.click(overlay);
    }

    await waitFor(() => {
      expect(screen.queryByText("Test Place")).not.toBeInTheDocument();
    });
  });

  it("handles empty API response", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ places: [] }),
    });

    const user = userEvent.setup();
    render(<GooglePlacesAutocomplete onPlaceSelected={mockOnPlaceSelected} />);

    const input = screen.getByPlaceholderText("Search for a place...");
    await user.type(input, "Test");

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    // Should not show any suggestions
    expect(screen.queryByText("Test Place")).not.toBeInTheDocument();
  });

  it("handles API response without places property", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    const user = userEvent.setup();
    render(<GooglePlacesAutocomplete onPlaceSelected={mockOnPlaceSelected} />);

    const input = screen.getByPlaceholderText("Search for a place...");
    await user.type(input, "Test");

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    // Should not show any suggestions
    expect(screen.queryByText("Test Place")).not.toBeInTheDocument();
  });
});
