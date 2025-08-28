import { UseFormReturn } from "react-hook-form";

import { AccommodationFormValues } from "@/types/forms";
import { Place } from "@/types/trip";

import { DatePicker } from "@/components/ui/date-picker";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PlaceSelectionField } from "@/components/ui/PlaceSelectionField";
import { PlaceToggleButton } from "@/components/ui/PlaceToggleButton";
import { SelectedPlaceCard } from "@/components/ui/SelectedPlaceCard";
import { Textarea } from "@/components/ui/textarea";

import { usePlaceSelection } from "@/hooks/usePlaceSelection";

export function AccommodationFormFields({
  form,
  onSubmit,
  children,
}: {
  form: UseFormReturn<AccommodationFormValues>;
  onSubmit: (values: AccommodationFormValues & { place?: Place }) => void;
  children?: React.ReactNode;
}) {
  const { selectedPlace, isManualMode, handlePlaceSelected, clearPlace, toggleManualMode } =
    usePlaceSelection({
      form,
    });

  const handleSubmit = (values: AccommodationFormValues) => {
    onSubmit({ ...values, place: selectedPlace || undefined });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 md:space-y-6">
        {/* Name Field - Google Places Search or Manual Input */}
        <PlaceSelectionField
          form={form}
          isManualEntry={isManualMode}
          onPlaceSelect={handlePlaceSelected}
          label="Name"
          placeholder={
            isManualMode ? "Enter accommodation name manually" : "Search for accommodation..."
          }
        />

        {/* Manual Entry Toggle */}
        {!selectedPlace && (
          <div className="text-sm">
            {!isManualMode && "Can't find it? "}
            <PlaceToggleButton
              isManualEntry={isManualMode}
              onToggle={toggleManualMode}
              searchText="Search for a place instead"
              manualText="Enter Accommodation Manually"
            />
          </div>
        )}

        {/* Selected Place Card */}
        {selectedPlace && <SelectedPlaceCard place={selectedPlace} onRemove={clearPlace} />}

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="check_in"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Check-in</FormLabel>
                <FormControl>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Pick a date"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="check_out"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Check-out</FormLabel>
                <FormControl>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Pick a date"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Booking URL</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Additional details" className="min-h-24" />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex gap-3 md:gap-6">{children}</div>
      </form>
    </Form>
  );
}
