"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Activity } from "@/types/trip";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

import {
  activityTypes,
  activityTypeLabels,
  activityTypeIcons,
} from "@/lib/constants/activityTypes";
import { useDeleteActivity } from "@/lib/mutations/useDeleteActivity";
import { useUpdateActivity } from "@/lib/mutations/useUpdateActivity";

const formSchema = z.object({
  name: z.string().min(1),
  date: z.string().min(1),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  notes: z.string().optional(),
  activity_type: z.enum(activityTypes),
});

type FormData = z.infer<typeof formSchema>;

export function EditActivityDialog({
  activity,
  open,
  onOpenChange,
}: {
  activity: Activity;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: activity.name,
      date: activity.date,
      start_time: activity.start_time || "",
      end_time: activity.end_time || "",
      notes: activity.notes || "",
      activity_type: activity.activity_type,
    },
  });

  const updateMutation = useUpdateActivity(activity.id);
  const deleteMutation = useDeleteActivity(activity.id);

  function onSubmit(values: FormData) {
    updateMutation.mutate({ ...values, id: activity.id }, { onSuccess: () => onOpenChange(false) });
  }

  function handleDelete() {
    if (confirm("Delete this activity?")) {
      deleteMutation.mutate({ id: activity.id }, { onSuccess: () => onOpenChange(false) });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <div className="cursor-pointer">{/* Render children in parent */}</div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Activity</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* ...same fields as AddActivityForm... */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
                      <Input type="time" {...field} />
                    </FormControl>
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
                      <Input type="time" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="activity_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {activityTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          <span className="flex items-center gap-2">
                            <span>{activityTypeIcons[type]}</span>
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
            <div className="flex gap-2">
              <Button type="submit" disabled={updateMutation.isPending}>
                Save
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                Delete
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
