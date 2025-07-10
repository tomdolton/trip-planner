import { UseFormReturn } from "react-hook-form";

import { LocationFormValues } from "@/types/forms";

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

export function LocationFormFields({
  form,
  onSubmit,
  children,
}: {
  form: UseFormReturn<LocationFormValues>;
  onSubmit: (values: LocationFormValues) => void;
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
        <FormField
          control={form.control}
          name="region"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Region</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
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
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="lat"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lng"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-2">{children}</div>
      </form>
    </Form>
  );
}
