import { z } from 'zod';

export const tripSchema = z.object({
  title: z.string().min(1, 'Trip title is required'),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  description: z.string().optional(),
});

export type TripFormValues = z.infer<typeof tripSchema>;
