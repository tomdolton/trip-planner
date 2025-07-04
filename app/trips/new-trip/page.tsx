import TripForm from '@/components/TripForm';

export default function NewTripPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-3xl font-bold text-center mb-8 font-serif">New Trip Page</h1>
      <p className="text-lg text-center">
        This is the new trip page. You can create a new trip here.
      </p>

      <TripForm />
    </div>
  );
}
