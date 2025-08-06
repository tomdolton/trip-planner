import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

import { LocationFormValues } from "@/types/forms";
import { GooglePlaceResult } from "@/types/google-places";
import { TripPhase, Place } from "@/types/trip";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { GooglePlacesAutocomplete } from "@/components/ui/GooglePlacesAutocomplete";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { useUpsertPlace } from "@/lib/mutations/useUpsertPlace";

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
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isManualMode, setIsManualMode] = useState(false);
  const upsertPlace = useUpsertPlace();

  const handlePlaceSelected = async (googlePlace: GooglePlaceResult) => {
    try {
      const place = await upsertPlace.mutateAsync(googlePlace);
      setSelectedPlace(place);

      // Auto-fill the location name with the place name and update form field
      form.setValue("name", googlePlace.name);

      // Automatically extract and set region from formatted_address
      const addressParts = googlePlace.formatted_address.split(", ");
      if (addressParts.length > 1) {
        // Take the second-to-last part as the region (typically city/area)
        const region = addressParts[addressParts.length - 2] || "";
        form.setValue("region", region);
      }

      // Exit manual mode since a place was selected
      setIsManualMode(false);

      // Clear any validation errors since we now have a valid name
      form.clearErrors("name");
    } catch (error) {
      console.error("Error saving place:", error);
    }
  };

  const handleSubmit = (values: LocationFormValues) => {
    onSubmit({ ...values, place: selectedPlace || undefined });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 md:space-y-6">
        {/* Name Field - Google Places Search or Manual Input */}
        {!isManualMode ? (
          <FormField
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <GooglePlacesAutocomplete
                    onPlaceSelected={handlePlaceSelected}
                    placeholder="Search for a place..."
                    value={field.value}
                    onChange={field.onChange}
                    autoFocus={!!fieldState.error}
                    aria-invalid={!!fieldState.error}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter location name manually"
                    onChange={(e) => {
                      field.onChange(e);
                      // Clear selected place when typing manually
                      if (selectedPlace) {
                        setSelectedPlace(null);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Manual Entry Toggle */}
        {!selectedPlace && (
          <div className="text-sm">
            <div>
              {!isManualMode && "Can't find it? "}

              <button
                type="button"
                className="underline cursor-pointer font-medium"
                onClick={() => setIsManualMode(!isManualMode)}
              >
                {isManualMode ? "Search for a place instead" : "Enter Location Manually"}
              </button>
            </div>
          </div>
        )}

        {/* Selected Place Card */}
        {selectedPlace && (
          <Card>
            <CardContent className="p-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{selectedPlace.name}</h4>
                  <p className="text-sm text-muted-foreground">{selectedPlace.formatted_address}</p>
                  {selectedPlace.rating && <p className="text-sm">⭐ {selectedPlace.rating}</p>}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedPlace(null);
                    setIsManualMode(false);
                    form.setValue("name", "");
                    form.setValue("region", "");
                  }}
                >
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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

        <div className="flex gap-2 mt-5 md:mt-6">{children}</div>
      </form>
    </Form>
  );
}
