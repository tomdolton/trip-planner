jest.mock('@/lib/mutations/useUpdateTrip');

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditTripForm from '../EditTripForm';
import { Trip } from '@/types/trip';
import { useUpdateTrip } from '@/lib/mutations/useUpdateTrip';

const mockTrip: Trip = {
  id: 'trip1',
  name: 'Test Trip',
  start_date: '2025-08-01',
  end_date: '2025-08-10',
  notes: 'Some notes',
};

describe('EditTripForm', () => {
  const onCloseMock = jest.fn();
  const mutateMock = jest.fn();

  beforeEach(() => {
    (useUpdateTrip as jest.Mock).mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    });
  });

  it('renders form with default values', () => {
    render(<EditTripForm trip={mockTrip} onClose={onCloseMock} />);

    expect(screen.getByDisplayValue('Test Trip')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2025-08-01')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2025-08-10')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Some notes')).toBeInTheDocument();
  });

  it('submits updated trip data', async () => {
    render(<EditTripForm trip={mockTrip} onClose={onCloseMock} />);

    fireEvent.change(screen.getByLabelText('Trip Name'), {
      target: { value: 'Updated Trip Name' },
    });

    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Updated Trip Name',
          id: 'trip1',
        }),
        expect.any(Object)
      );
    });
  });
});
