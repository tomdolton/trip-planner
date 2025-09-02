import { renderHook, act } from "@testing-library/react";
import { useForm, UseFormReturn } from "react-hook-form";

import { GooglePlaceResult } from "@/types/google-places";
import { Place } from "@/types/trip";

import { usePlaceSelection } from "../usePlaceSelection";

// Mock the useUpsertPlace hook
const mockMutateAsync = jest.fn();
jest.mock("@/lib/mutations/useUpsertPlace", () => ({
  useUpsertPlace: () => ({
    mutateAsync: mockMutateAsync,
  }),
}));

describe("usePlaceSelection", () => {
  let mockForm: UseFormReturn<{ name: string }>;

  beforeEach(() => {
    const { result } = renderHook(() =>
      useForm({
        defaultValues: {
          name: "",
        },
      })
    );
    mockForm = result.current;
    mockMutateAsync.mockClear();
    console.error = jest.fn(); // Suppress console.error in tests
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() =>
      usePlaceSelection({
        form: mockForm,
      })
    );

    expect(result.current.selectedPlace).toBeNull();
    expect(result.current.isManualMode).toBe(false);
  });

  it("should handle place selection successfully", async () => {
    const mockPlace: Place = {
      id: "place-1",
      name: "Tokyo Station",
      description: "Major railway station",
      lat: 35.6812,
      lng: 139.7671,
      is_google_place: true,
    };

    const mockGooglePlace: GooglePlaceResult = {
      place_id: "google-place-1",
      name: "Tokyo Station",
      formatted_address: "1 Chome Marunouchi, Chiyoda City, Tokyo",
      lat: 35.6812,
      lng: 139.7671,
      types: ["train_station"],
    };

    mockMutateAsync.mockResolvedValue(mockPlace);
    mockForm.setValue = jest.fn();
    mockForm.clearErrors = jest.fn();

    const { result } = renderHook(() =>
      usePlaceSelection({
        form: mockForm,
      })
    );

    await act(async () => {
      await result.current.handlePlaceSelected(mockGooglePlace);
    });

    expect(mockMutateAsync).toHaveBeenCalledWith(mockGooglePlace);
    expect(result.current.selectedPlace).toEqual(mockPlace);
    expect(result.current.isManualMode).toBe(false);
    expect(mockForm.setValue).toHaveBeenCalledWith("name", "Tokyo Station");
    expect(mockForm.clearErrors).toHaveBeenCalledWith("name");
  });

  it("should call onPlaceSelected callback when provided", async () => {
    const mockPlace: Place = {
      id: "place-1",
      name: "Tokyo Station",
      description: "Major railway station",
      lat: 35.6812,
      lng: 139.7671,
      is_google_place: true,
    };

    const mockGooglePlace: GooglePlaceResult = {
      place_id: "google-place-1",
      name: "Tokyo Station",
      formatted_address: "1 Chome Marunouchi, Chiyoda City, Tokyo",
      lat: 35.6812,
      lng: 139.7671,
      types: ["train_station"],
    };

    const onPlaceSelectedMock = jest.fn();
    mockMutateAsync.mockResolvedValue(mockPlace);
    mockForm.setValue = jest.fn();
    mockForm.clearErrors = jest.fn();

    const { result } = renderHook(() =>
      usePlaceSelection({
        form: mockForm,
        onPlaceSelected: onPlaceSelectedMock,
      })
    );

    await act(async () => {
      await result.current.handlePlaceSelected(mockGooglePlace);
    });

    expect(onPlaceSelectedMock).toHaveBeenCalledWith(mockPlace, mockGooglePlace);
  });

  it("should handle place selection error", async () => {
    const mockGooglePlace: GooglePlaceResult = {
      place_id: "google-place-1",
      name: "Tokyo Station",
      formatted_address: "1 Chome Marunouchi, Chiyoda City, Tokyo",
      lat: 35.6812,
      lng: 139.7671,
      types: ["train_station"],
    };

    mockMutateAsync.mockRejectedValue(new Error("Failed to save place"));
    mockForm.setValue = jest.fn();
    mockForm.clearErrors = jest.fn();

    const { result } = renderHook(() =>
      usePlaceSelection({
        form: mockForm,
      })
    );

    await act(async () => {
      await result.current.handlePlaceSelected(mockGooglePlace);
    });

    expect(console.error).toHaveBeenCalledWith("Error saving place:", expect.any(Error));
    expect(result.current.selectedPlace).toBeNull();
  });

  it("should clear place and form when clearPlace is called", () => {
    mockForm.setValue = jest.fn();

    const { result } = renderHook(() =>
      usePlaceSelection({
        form: mockForm,
      })
    );

    // Manually set a selected place and manual mode
    act(() => {
      result.current.setIsManualMode(true);
    });

    act(() => {
      result.current.clearPlace();
    });

    expect(result.current.selectedPlace).toBeNull();
    expect(result.current.isManualMode).toBe(false);
    expect(mockForm.setValue).toHaveBeenCalledWith("name", "");
  });

  it("should toggle manual mode", () => {
    const { result } = renderHook(() =>
      usePlaceSelection({
        form: mockForm,
      })
    );

    expect(result.current.isManualMode).toBe(false);

    act(() => {
      result.current.toggleManualMode();
    });

    expect(result.current.isManualMode).toBe(true);

    act(() => {
      result.current.toggleManualMode();
    });

    expect(result.current.isManualMode).toBe(false);
  });

  it("should allow direct setting of manual mode", () => {
    const { result } = renderHook(() =>
      usePlaceSelection({
        form: mockForm,
      })
    );

    expect(result.current.isManualMode).toBe(false);

    act(() => {
      result.current.setIsManualMode(true);
    });

    expect(result.current.isManualMode).toBe(true);

    act(() => {
      result.current.setIsManualMode(false);
    });

    expect(result.current.isManualMode).toBe(false);
  });
});
