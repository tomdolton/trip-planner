import { UseFormReturn } from "react-hook-form";

import { LocationFormValues } from "@/types/forms";
import { TripPhase, Place } from "@/types/trip";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { PlaceSelectionField } from "@/components/ui/PlaceSelectionField";
import { PlaceToggleButton } from "@/components/ui/PlaceToggleButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectedPlaceCard } from "@/components/ui/SelectedPlaceCard";
import { Textarea } from "@/components/ui/textarea";

import { usePlaceSelection } from "@/hooks/usePlaceSelection";

interface LocationFormFieldsProps {
  form: UseFormReturn<LocationFormValues>;
  onSubmit: (values: LocationFormValues & { place?: Place }) => void;
  children?: React.ReactNode;
  phases?: TripPhase[];
  showPhaseSelector?: boolean;
}

export function LocationFormFields({
  form,
  onSubmit,
  children,
  phases = [],
  showPhaseSelector = false,
}: LocationFormFieldsProps) {
  const { selectedPlace, isManualMode, handlePlaceSelected, clearPlace, toggleManualMode } =
    usePlaceSelection({
      form,
      onPlaceSelected: (place, googlePlace) => {
        // Automatically extract and set region from formatted_address
        const addressParts = googlePlace.formatted_address.split(", ");
        if (addressParts.length > 1) {
          // Take the second-to-last part as the region (typically city/area)
          const region = addressParts[addressParts.length - 2] || "";
          form.setValue("region", region);
        }
      },
    });

  const handleSubmit = (values: LocationFormValues) => {
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
          placeholder={isManualMode ? "Enter location name manually" : "Search for a place..."}
        />

        {/* Manual Entry Toggle */}
        {!selectedPlace && (
          <div className="text-sm">
            {!isManualMode && "Can't find it? "}
            <PlaceToggleButton
              isManualEntry={isManualMode}
              onToggle={toggleManualMode}
              searchText="Search for a place instead"
              manualText="Enter Location Manually"
            />
          </div>
        )}

        {/* Selected Place Card */}
        {selectedPlace && <SelectedPlaceCard place={selectedPlace} onRemove={clearPlace} />}

        {/* Phase Selector and Notes */}
        {showPhaseSelector && phases.length > 0 && (
          <FormField
            control={form.control}
            name="phaseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assign to Trip Phase</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a phase (optional)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="no-phase">No phase (unassigned)</SelectItem>
                    {phases.map((phase) => (
                      <SelectItem key={phase.id} value={phase.id}>
                        {phase.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Any additional details" className="min-h-24" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3 md:gap-6 mt-6">{children}</div>
      </form>
    </Form>
  );
}
