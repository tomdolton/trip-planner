jest.mock('@/lib/mutations/useAddTrip');

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TripForm from '../TripForm';
import { useAddTrip } from '@/lib/mutations/useAddTrip';

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('TripForm', () => {
  const mutateMock = jest.fn();

  beforeEach(() => {
    (useAddTrip as jest.Mock).mockReturnValue({
      mutate: mutateMock,
      isSuccess: false,
      isError: false,
      error: null,
      isPending: false,
    });
  });

  it('renders form fields', () => {
    render(<TripForm />);
    expect(screen.getByLabelText(/trip title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it('submits valid form', async () => {
    render(<TripForm />);

    fireEvent.change(screen.getByLabelText(/trip title/i), { target: { value: 'Japan Trip' } });
    fireEvent.change(screen.getByLabelText(/start date/i), { target: { value: '2025-08-01' } });
    fireEvent.change(screen.getByLabelText(/end date/i), { target: { value: '2025-08-10' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Exciting!' } });

    fireEvent.click(screen.getByRole('button', { title: /save trip/i }));

    await waitFor(() =>
      expect(mutateMock).toHaveBeenCalledWith(
        {
          title: 'Japan Trip',
          start_date: '2025-08-01',
          end_date: '2025-08-10',
          description: 'Exciting!',
        },
        expect.any(Object) // handles config like onSuccess
      )
    );
  });
});
