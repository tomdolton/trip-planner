/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock("@/hooks/useUser");
jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn(),
    auth: {
      getUser: jest.fn(),
    },
  },
}));
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase";

import { useUser } from "@/hooks/useUser";

import { useAddTrip } from "../useAddTrip";

const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;
const mockSupabase = supabase as jest.Mocked<typeof supabase>;
const mockToast = toast as jest.Mocked<typeof toast>;

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

describe("useAddTrip", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should add trip successfully", async () => {
    const mockUser = {
      id: "user-123",
      email: "test@example.com",
      app_metadata: {},
      user_metadata: {},
      aud: "authenticated",
      created_at: "2024-01-01T00:00:00Z",
    };

    const tripData = {
      title: "Test Trip",
      start_date: "2024-06-01",
      end_date: "2024-06-15",
      description: "A test trip",
    };

    const mockInsertedTrip = {
      id: "trip-123",
      ...tripData,
      user_id: mockUser.id,
    };

    mockUseUser.mockReturnValue({ user: mockUser, loading: false });

    const mockInsert = jest.fn().mockReturnThis();
    const mockSelect = jest.fn().mockResolvedValue({ data: [mockInsertedTrip], error: null });

    mockSupabase.from.mockReturnValue({
      insert: mockInsert,
    } as any);

    mockInsert.mockReturnValue({
      select: mockSelect,
    } as any);

    const { result } = renderHook(() => useAddTrip(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isPending).toBe(false);

    // Trigger the mutation
    result.current.mutate(tripData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockSupabase.from).toHaveBeenCalledWith("trips");
    expect(mockInsert).toHaveBeenCalledWith([
      {
        title: "Test Trip",
        start_date: "2024-06-01",
        end_date: "2024-06-15",
        description: "A test trip",
        user_id: mockUser.id,
      },
    ]);
    expect(mockSelect).toHaveBeenCalled();
    expect(mockToast.success).toHaveBeenCalledWith("Trip added successfully!");
  });

  it("should handle optional fields correctly", async () => {
    const mockUser = {
      id: "user-123",
      email: "test@example.com",
      app_metadata: {},
      user_metadata: {},
      aud: "authenticated",
      created_at: "2024-01-01T00:00:00Z",
    };

    const tripData = {
      title: "Minimal Trip",
      // No start_date, end_date, or description
    };

    const mockInsertedTrip = {
      id: "trip-123",
      ...tripData,
      user_id: mockUser.id,
    };

    mockUseUser.mockReturnValue({ user: mockUser, loading: false });

    const mockInsert = jest.fn().mockReturnThis();
    const mockSelect = jest.fn().mockResolvedValue({ data: [mockInsertedTrip], error: null });

    mockSupabase.from.mockReturnValue({
      insert: mockInsert,
    } as any);

    mockInsert.mockReturnValue({
      select: mockSelect,
    } as any);

    const { result } = renderHook(() => useAddTrip(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(tripData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockInsert).toHaveBeenCalledWith([
      {
        title: "Minimal Trip",
        start_date: null,
        end_date: null,
        description: null,
        user_id: mockUser.id,
      },
    ]);
  });

  it("should handle empty string fields correctly", async () => {
    const mockUser = {
      id: "user-123",
      email: "test@example.com",
      app_metadata: {},
      user_metadata: {},
      aud: "authenticated",
      created_at: "2024-01-01T00:00:00Z",
    };

    const tripData = {
      title: "Trip with Empty Fields",
      start_date: "",
      end_date: "",
      description: "",
    };

    const mockInsertedTrip = {
      id: "trip-123",
      ...tripData,
      user_id: mockUser.id,
    };

    mockUseUser.mockReturnValue({ user: mockUser, loading: false });

    const mockInsert = jest.fn().mockReturnThis();
    const mockSelect = jest.fn().mockResolvedValue({ data: [mockInsertedTrip], error: null });

    mockSupabase.from.mockReturnValue({
      insert: mockInsert,
    } as any);

    mockInsert.mockReturnValue({
      select: mockSelect,
    } as any);

    const { result } = renderHook(() => useAddTrip(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(tripData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockInsert).toHaveBeenCalledWith([
      {
        title: "Trip with Empty Fields",
        start_date: null, // Empty strings should become null
        end_date: null,
        description: null,
        user_id: mockUser.id,
      },
    ]);
  });

  it("should throw error when user is not authenticated", async () => {
    mockUseUser.mockReturnValue({ user: null, loading: false });

    const tripData = {
      title: "Test Trip",
    };

    const { result } = renderHook(() => useAddTrip(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(tripData);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(new Error("User not authenticated"));
    expect(mockSupabase.from).not.toHaveBeenCalled();
    expect(mockToast.error).toHaveBeenCalledWith("Error adding trip", {
      description: "User not authenticated",
    });
  });

  it("should handle supabase error", async () => {
    const mockUser = {
      id: "user-123",
      email: "test@example.com",
      app_metadata: {},
      user_metadata: {},
      aud: "authenticated",
      created_at: "2024-01-01T00:00:00Z",
    };

    const tripData = {
      title: "Test Trip",
    };

    const mockError = { message: "Database error" };

    mockUseUser.mockReturnValue({ user: mockUser, loading: false });

    const mockInsert = jest.fn().mockReturnThis();
    const mockSelect = jest.fn().mockResolvedValue({ data: null, error: mockError });

    mockSupabase.from.mockReturnValue({
      insert: mockInsert,
    } as any);

    mockInsert.mockReturnValue({
      select: mockSelect,
    } as any);

    const { result } = renderHook(() => useAddTrip(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(tripData);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(new Error("Database error"));
    expect(mockToast.error).toHaveBeenCalledWith("Error adding trip", {
      description: "Database error",
    });
  });

  it("should invalidate trips query on success", async () => {
    const mockUser = {
      id: "user-123",
      email: "test@example.com",
      app_metadata: {},
      user_metadata: {},
      aud: "authenticated",
      created_at: "2024-01-01T00:00:00Z",
    };

    const tripData = {
      title: "Test Trip",
    };

    const mockInsertedTrip = {
      id: "trip-123",
      ...tripData,
      user_id: mockUser.id,
    };

    mockUseUser.mockReturnValue({ user: mockUser, loading: false });

    const mockInsert = jest.fn().mockReturnThis();
    const mockSelect = jest.fn().mockResolvedValue({ data: [mockInsertedTrip], error: null });

    mockSupabase.from.mockReturnValue({
      insert: mockInsert,
    } as any);

    mockInsert.mockReturnValue({
      select: mockSelect,
    } as any);

    // Create a query client with a spy on invalidateQueries
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
        mutations: { retry: false },
      },
    });
    const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useAddTrip(), {
      wrapper: Wrapper,
    });

    result.current.mutate(tripData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ["trips"] });

    invalidateQueriesSpy.mockRestore();
  });
});
