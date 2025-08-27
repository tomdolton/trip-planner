import { UseFormReturn } from "react-hook-form";

import { JourneyFormValues } from "@/types/forms";

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
import { JourneyPlaceField } from "@/components/ui/JourneyPlaceField";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { journeyModes, journeyModeLabels } from "@/lib/constants/journeyModes";
import { formatTimeForDisplay } from "@/lib/utils/dateTime";

import { JourneyIcon } from "./JourneyIcon";

export function JourneyFormFields({
  form,
  onSubmit,
  children,
}: {
  form: UseFormReturn<JourneyFormValues>;
  onSubmit: (values: JourneyFormValues) => void;
  children?: React.ReactNode; // For custom action buttons
}) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="mode"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Transport Mode</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select transport mode" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {journeyModes.map((mode) => (
                    <SelectItem key={mode} value={mode}>
                      <span className="flex items-center gap-2">
                        <JourneyIcon mode={mode} size={16} />
                        <span>{journeyModeLabels[mode]}</span>
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
          name="provider"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Provider / Booking Reference</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. British Airways, National Express" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Places Section */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="departure_place_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departure Location</FormLabel>
                <FormControl>
                  <JourneyPlaceField
                    field={field}
                    placeholder="Search for departure station, airport, etc."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="arrival_place_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Arrival Location</FormLabel>
                <FormControl>
                  <JourneyPlaceField
                    field={field}
                    placeholder="Search for arrival station, airport, etc."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Departure and Arrival Date/Time Section */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <FormField
              control={form.control}
              name="departure_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departure Date</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        // Auto-set arrival date to departure date if arrival date is empty
                        if (value && !form.getValues("arrival_date")) {
                          form.setValue("arrival_date", value);
                        }
                      }}
                      placeholder="Select date"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="departure_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departure Time</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      value={formatTimeForDisplay(field.value)}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="[&::-webkit-calendar-picker-indicator]:hidden"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="arrival_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arrival Date</FormLabel>
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
            <FormField
              control={form.control}
              name="arrival_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arrival Time</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      value={formatTimeForDisplay(field.value)}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="[&::-webkit-calendar-picker-indicator]:hidden"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Additional journey details"
                  className="min-h-24"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="mt-6 flex gap-3 md:gap-6">{children}</div>
      </form>
    </Form>
  );
}
