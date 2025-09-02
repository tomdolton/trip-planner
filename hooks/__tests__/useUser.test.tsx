import type { User, AuthChangeEvent, Session } from "@supabase/supabase-js";
import { renderHook, waitFor } from "@testing-library/react";

// Mock supabase before importing
jest.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
  },
}));

import { supabase } from "@/lib/supabase";

import { useUser } from "../useUser";

describe("useUser", () => {
  let mockUnsubscribe: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUnsubscribe = jest.fn();

    // Default mock setup
    (supabase.auth.onAuthStateChange as jest.Mock).mockReturnValue({
      data: {
        subscription: {
          unsubscribe: mockUnsubscribe,
          id: "subscription-id",
          callback: jest.fn(),
        },
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with loading state", () => {
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const { result } = renderHook(() => useUser());

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(true);
  });

  it("should fetch user successfully", async () => {
    const mockUser: User = {
      id: "user-123",
      email: "test@example.com",
      user_metadata: { full_name: "Test User" },
      app_metadata: {},
      aud: "authenticated",
      created_at: "2023-01-01T00:00:00Z",
      email_confirmed_at: undefined,
      phone: undefined,
      confirmed_at: undefined,
      last_sign_in_at: undefined,
      role: "authenticated",
      updated_at: undefined,
    };

    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    const { result } = renderHook(() => useUser());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(supabase.auth.getUser).toHaveBeenCalled();
  });

  it("should handle no user", async () => {
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const { result } = renderHook(() => useUser());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
  });

  it("should handle auth state changes - user login", async () => {
    const mockUser: User = {
      id: "user-123",
      email: "test@example.com",
      user_metadata: { full_name: "Test User" },
      app_metadata: {},
      aud: "authenticated",
      created_at: "2023-01-01T00:00:00Z",
      email_confirmed_at: undefined,
      phone: undefined,
      confirmed_at: undefined,
      last_sign_in_at: undefined,
      role: "authenticated",
      updated_at: undefined,
    };

    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: null },
      error: null,
    });

    // Mock onAuthStateChange to capture callback
    let authStateCallback: ((event: AuthChangeEvent, session: Session | null) => void) | null =
      null;
    (supabase.auth.onAuthStateChange as jest.Mock).mockImplementation((callback) => {
      authStateCallback = callback;
      return {
        data: {
          subscription: {
            unsubscribe: mockUnsubscribe,
            id: "subscription-id",
            callback: jest.fn(),
          },
        },
      };
    });

    const { result } = renderHook(() => useUser());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();

    // Simulate auth state change with user login
    authStateCallback!("SIGNED_IN", { user: mockUser } as Session);

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });
  });

  it("should handle auth state change with user logout", async () => {
    const mockUser: User = {
      id: "user-123",
      email: "test@example.com",
      app_metadata: {},
      aud: "authenticated",
      created_at: "2023-01-01T00:00:00Z",
      user_metadata: {},
      email_confirmed_at: undefined,
      phone: undefined,
      confirmed_at: undefined,
      last_sign_in_at: undefined,
      role: "authenticated",
      updated_at: undefined,
    };

    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    // Mock onAuthStateChange to capture callback
    let authStateCallback: ((event: AuthChangeEvent, session: Session | null) => void) | null =
      null;
    (supabase.auth.onAuthStateChange as jest.Mock).mockImplementation((callback) => {
      authStateCallback = callback;
      return {
        data: {
          subscription: {
            unsubscribe: mockUnsubscribe,
            id: "subscription-id",
            callback: jest.fn(),
          },
        },
      };
    });

    const { result } = renderHook(() => useUser());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);

    // Simulate auth state change with user logout
    authStateCallback!("SIGNED_OUT", null);

    await waitFor(() => {
      expect(result.current.user).toBeNull();
    });
  });

  it("should setup auth state listener", () => {
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: null },
      error: null,
    });

    renderHook(() => useUser());

    expect(supabase.auth.onAuthStateChange).toHaveBeenCalledWith(expect.any(Function));
  });

  it("should unsubscribe on unmount", async () => {
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const { unmount } = renderHook(() => useUser());

    await waitFor(() => {
      expect(supabase.auth.onAuthStateChange).toHaveBeenCalled();
    });

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it("should handle undefined user data", async () => {
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const { result } = renderHook(() => useUser());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
  });
});
