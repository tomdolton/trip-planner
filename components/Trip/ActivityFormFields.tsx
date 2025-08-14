import { UseFormReturn } from "react-hook-form";

import { ActivityFormValues } from "@/types/forms";
import { Place } from "@/types/trip";

import { ActivityIcon } from "@/components/ui/ActivityIcon";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { SelectedPlaceCard } from "@/components/ui/SelectedPlaceCard";
import { Textarea } from "@/components/ui/textarea";

import { activityTypes, activityTypeLabels, ActivityType } from "@/lib/constants/activityTypes";
import { formatTimeForDisplay } from "@/lib/utils/dateTime";

import { usePlaceSelection } from "@/hooks/usePlaceSelection";

export function ActivityFormFields({
  form,
  onSubmit,
  children,
}: {
  form: UseFormReturn<ActivityFormValues>;
  onSubmit: (values: ActivityFormValues & { place?: Place }) => void;
  children?: React.ReactNode; // For custom action buttons
}) {
  const { selectedPlace, isManualMode, handlePlaceSelected, clearPlace, toggleManualMode } =
    usePlaceSelection({
      form,
    });

  const handleSubmit = (values: ActivityFormValues) => {
    onSubmit({ ...values, place: selectedPlace || undefined });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Name Field - Google Places Search or Manual Input */}
        <PlaceSelectionField
          form={form}
          isManualEntry={isManualMode}
          onPlaceSelect={handlePlaceSelected}
          label="Activity Name"
          placeholder={
            isManualMode ? "Enter activity name manually" : "Search for a place or activity..."
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
              manualText="Enter Activity Manually"
            />
          </div>
        )}

        {/* Selected Place Card */}
        {selectedPlace && <SelectedPlaceCard place={selectedPlace} onRemove={clearPlace} />}

        <FormField
          control={form.control}
          name="activity_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Activity Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {activityTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      <span className="flex items-center gap-2">
                        <ActivityIcon activityType={type as ActivityType} />
                        <span>{activityTypeLabels[type]}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Date</FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select date"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="start_time"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    value={formatTimeForDisplay(field.value)}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="end_time"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    value={formatTimeForDisplay(field.value)}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
