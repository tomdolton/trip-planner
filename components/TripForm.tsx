'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useAddTrip } from '@/lib/mutations/useAddTrip';
import { TripFormValues, tripSchema } from '@/types/forms';

export default function TripForm() {
  const [message, setMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TripFormValues>({ resolver: zodResolver(tripSchema) });

  const addTrip = useAddTrip();

  const onSubmit = async (data: TripFormValues) => {
    setMessage('');
    try {
      await addTrip.mutateAsync(data);
      setMessage('Trip added!');
    } catch (err: any) {
      setMessage(err.message);
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
