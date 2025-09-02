/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";

// Mock dependencies first before importing
jest.mock("@/hooks/useUser");
jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn(),
    auth: {
      getUser: jest.fn(),
    },
  },
}));

import { supabase } from "@/lib/supabase";

import { useUser } from "@/hooks/useUser";

import { useTrips } from "../useTrips";

const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;
const mockSupabase = supabase as jest.Mocked<typeof supabase>;

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return Wrapper;
}

describe("useTrips", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should not fetch trips when user is not authenticated", () => {
    mockUseUser.mockReturnValue({ user: null, loading: false });

    const { result } = renderHook(() => useTrips(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(mockSupabase.from).not.toHaveBeenCalled();
  });

  it("should fetch trips successfully when user is authenticated", async () => {
    const mockUser = {
      id: "user-123",
      email: "test@example.com",
      app_metadata: {},
      user_metadata: {},
      aud: "authenticated",
      created_at: "2024-01-01T00:00:00Z",
    };
    const mockTrips = [
      {
        id: "trip-1",
        title: "Test Trip 1",
        user_id: "user-123",
        created_at: "2024-01-01T00:00:00Z",
      },
      {
        id: "trip-2",
        title: "Test Trip 2",
        user_id: "user-123",
        created_at: "2024-01-02T00:00:00Z",
      },
    ];

    mockUseUser.mockReturnValue({ user: mockUser, loading: false });

    const mockSelect = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockReturnThis();
    const mockOrder = jest.fn().mockResolvedValue({ data: mockTrips, error: null });

    mockSupabase.from.mockReturnValue({
      select: mockSelect,
    } as any);

    mockSelect.mockReturnValue({
      eq: mockEq,
    } as any);

    mockEq.mockReturnValue({
      order: mockOrder,
    } as any);

    const { result } = renderHook(() => useTrips(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockTrips);
    expect(mockSupabase.from).toHaveBeenCalledWith("trips");
    expect(mockSelect).toHaveBeenCalledWith("*");
    expect(mockEq).toHaveBeenCalledWith("user_id", mockUser.id);
    expect(mockOrder).toHaveBeenCalledWith("created_at", { ascending: false });
  });

  it("should handle error when fetching trips fails", async () => {
    const mockUser = {
      id: "user-123",
      email: "test@example.com",
      app_metadata: {},
      user_metadata: {},
      aud: "authenticated",
      created_at: "2024-01-01T00:00:00Z",
    };
    const mockError = { message: "Database error" };

    mockUseUser.mockReturnValue({ user: mockUser, loading: false });

    const mockSelect = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockReturnThis();
    const mockOrder = jest.fn().mockResolvedValue({ data: null, error: mockError });

    mockSupabase.from.mockReturnValue({
      select: mockSelect,
    } as any);

    mockSelect.mockReturnValue({
      eq: mockEq,
    } as any);

    mockEq.mockReturnValue({
      order: mockOrder,
    } as any);

    const { result } = renderHook(() => useTrips(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeTruthy();
    expect((result.current.error as Error).message).toBe("Database error");
  });

  it("should be enabled only when user exists", () => {
    // Test with no user
    mockUseUser.mockReturnValue({ user: null, loading: false });

    const { result: resultNoUser } = renderHook(() => useTrips(), {
      wrapper: createWrapper(),
    });

    expect(resultNoUser.current.isLoading).toBe(false);
    expect(resultNoUser.current.fetchStatus).toBe("idle");

    // Test with user
    const mockUser = {
      id: "user-123",
      email: "test@example.com",
      app_metadata: {},
      user_metadata: {},
      aud: "authenticated",
      created_at: "2024-01-01T00:00:00Z",
    };
    mockUseUser.mockReturnValue({ user: mockUser, loading: false });

    const mockSelect = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockReturnThis();
    const mockOrder = jest.fn().mockResolvedValue({ data: [], error: null });

    mockSupabase.from.mockReturnValue({
      select: mockSelect,
    } as any);

    mockSelect.mockReturnValue({
      eq: mockEq,
    } as any);

    mockEq.mockReturnValue({
      order: mockOrder,
    } as any);

    const { result: resultWithUser } = renderHook(() => useTrips(), {
      wrapper: createWrapper(),
    });

    expect(resultWithUser.current.isLoading).toBe(true);
  });
});
