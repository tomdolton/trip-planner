import { render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";

import { useUser } from "@/hooks/useUser";

import AuthGuard from "../AuthGuard";

// Mock the hooks
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/hooks/useUser", () => ({
  useUser: jest.fn(),
}));

describe("AuthGuard", () => {
  const mockPush = jest.fn();
  const mockReplace = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: mockReplace,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render children when user is authenticated", () => {
    (useUser as jest.Mock).mockReturnValue({
      user: { id: "123", email: "test@example.com" },
      loading: false,
    });

    render(
      <AuthGuard>
        <div data-testid="protected-content">Protected Content</div>
      </AuthGuard>
    );

    expect(screen.getByTestId("protected-content")).toBeInTheDocument();
  });

  it("should show loading when loading is true", () => {
    (useUser as jest.Mock).mockReturnValue({
      user: null,
      loading: true,
    });

    render(
      <AuthGuard>
        <div data-testid="protected-content">Protected Content</div>
      </AuthGuard>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
  });

  it("should redirect to login when user is not authenticated", () => {
    (useUser as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
    });

    render(
      <AuthGuard>
        <div data-testid="protected-content">Protected Content</div>
      </AuthGuard>
    );

    expect(mockReplace).toHaveBeenCalledWith("/login");
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
  });

  it("should show loading while redirecting", () => {
    (useUser as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
    });

    render(
      <AuthGuard>
        <div data-testid="protected-content">Protected Content</div>
      </AuthGuard>
    );

    // Should show loading even when loading is false but user is null
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
  });
});
