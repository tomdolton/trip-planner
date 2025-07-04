import { z } from 'zod';

export const tripSchema = z.object({
  name: z.string().min(1, 'Trip name is required'),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  notes: z.string().optional(),
});

export type TripFormValues = z.infer<typeof tripSchema>;
