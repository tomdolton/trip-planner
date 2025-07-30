import { UseFormReturn } from "react-hook-form";

import { JourneyFormValues } from "@/types/forms";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { journeyModes, journeyModeLabels, journeyModeIcons } from "@/lib/constants/journeyModes";

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="provider"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Journey Name/Provider</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. British Airways, National Express" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transport Mode</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transport mode" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {journeyModes.map((mode) => (
                    <SelectItem key={mode} value={mode}>
                      <span className="flex items-center gap-2">
                        <span>{journeyModeIcons[mode]}</span>
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

        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="departure_time"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Departure Date & Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="arrival_time"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Arrival Date & Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
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
                <Textarea {...field} placeholder="Additional journey details..." />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-2">{children}</div>
      </form>
    </Form>
  );
}
