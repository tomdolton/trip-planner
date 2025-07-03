'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/hooks/useUser';
import { useState } from 'react';

const tripSchema = z.object({
  name: z.string().min(1, 'Trip name is required'),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  notes: z.string().optional(),
});

type TripFormValues = z.infer<typeof tripSchema>;

export default function TripForm() {
  const { user } = useUser();
  const [message, setMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TripFormValues>({ resolver: zodResolver(tripSchema) });

  const onSubmit = async (data: TripFormValues) => {
    setMessage('');
    if (!user) return;

    const { error } = await supabase.from('trips').insert([
      {
        user_id: user.id,
        name: data.name,
        start_date: data.start_date || null,
        end_date: data.end_date || null,
        notes: data.notes || null,
      },
    ]);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Trip added!');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Add a New Trip</h2>

      <input {...register('name')} placeholder="Trip Name" className="input" />
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}

      <input type="date" {...register('start_date')} className="input" />
      <input type="date" {...register('end_date')} className="input" />

      <textarea {...register('notes')} placeholder="Notes..." className="input" />

      <button type="submit" className="btn">
        Save Trip
      </button>
      {message && <p className="text-blue-600">{message}</p>}
    </form>
  );
}
