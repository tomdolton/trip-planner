import { z } from "zod";

import { activityTypes } from "@/lib/constants/activityTypes";

export const tripSchema = z.object({
  title: z.string().min(1, "Trip title is required"),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  description: z.string().optional(),
});

export const activityFormSchema = z
  .object({
    name: z.string().min(1),
    date: z.string().min(1),
    start_time: z.string().optional(),
    end_time: z.string().optional(),
    notes: z.string().optional(),
    activity_type: z.enum(activityTypes),
  })
  .refine(
    (data) => {
      // If both start_time and end_time are provided, ensure end_time is after start_time
      if (data.start_time && data.end_time) {
        return data.end_time >= data.start_time;
      }
      return true;
    },
    {
      message: "End time must be after start time",
      path: ["end_time"],
    }
  );

export const accommodationFormSchema = z
  .object({
    name: z.string().min(1, "Accommodation name is required"),
    check_in: z.string().optional(),
    check_out: z.string().optional(),
    url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      // If both check_in and check_out are provided, ensure check_out is after check_in
      if (data.check_in && data.check_out) {
        return data.check_out >= data.check_in;
      }
      return true;
    },
    {
      message: "Check-out date must be after check-in date",
      path: ["check_out"],
    }
  );

export const locationFormSchema = z.object({
  name: z.string().min(1, "Location name is required"),
  region: z.string().optional(),
  notes: z.string().optional(),
  phaseId: z.string().optional(),
});

export const journeyFormSchema = z.object({
  provider: z.string().optional(),
  mode: z.string().min(1, "Transport mode is required"),
  departure_date: z.string().optional(),
  departure_time: z.string().optional(),
  arrival_date: z.string().optional(),
  arrival_time: z.string().optional(),
  notes: z.string().optional(),
});

export const tripPhaseFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  start_date: z.string().optional().or(z.literal("")),
  end_date: z.string().optional().or(z.literal("")),
});

export type TripFormValues = z.infer<typeof tripSchema>;
export type ActivityFormValues = z.infer<typeof activityFormSchema>;
export type AccommodationFormValues = z.infer<typeof accommodationFormSchema>;
export type LocationFormValues = z.infer<typeof locationFormSchema>;
export type JourneyFormValues = z.infer<typeof journeyFormSchema>;
export type TripPhaseFormValues = z.infer<typeof tripPhaseFormSchema>;
