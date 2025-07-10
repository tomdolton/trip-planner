import { UseFormReturn } from "react-hook-form";

import { AccommodationFormValues } from "@/types/forms";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function AccommodationFormFields({
  form,
  onSubmit,
  children,
}: {
  form: UseFormReturn<AccommodationFormValues>;
  onSubmit: (values: AccommodationFormValues) => void;
  children?: React.ReactNode;
}) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="check_in"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Check-in</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
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
                  <Input type="date" {...field} />
                </FormControl>
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
                <Textarea {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex gap-2">{children}</div>
      </form>
    </Form>
  );
}
