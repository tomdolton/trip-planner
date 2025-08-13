import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./form";
import { Input } from "./input";
import { GooglePlacesAutocomplete } from "./GooglePlacesAutocomplete";
import { type UseFormReturn } from "react-hook-form";
import type { GooglePlaceResult } from "@/types/google-places";

interface PlaceSelectionFieldProps<T = Record<string, unknown>> {
  form: UseFormReturn<T & { name: string }>;
  isManualEntry: boolean;
  onPlaceSelect: (place: GooglePlaceResult) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

export function PlaceSelectionField<T = Record<string, unknown>>({
  form,
  isManualEntry,
  onPlaceSelect,
  label = "Name",
  placeholder = "Enter name",
  required = true,
}: PlaceSelectionFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      name={"name" as any}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <FormControl>
            {isManualEntry ? (
              <Input placeholder={placeholder} {...field} />
            ) : (
              <GooglePlacesAutocomplete
                value={field.value}
                onChange={field.onChange}
                onPlaceSelected={onPlaceSelect}
                placeholder={placeholder}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
