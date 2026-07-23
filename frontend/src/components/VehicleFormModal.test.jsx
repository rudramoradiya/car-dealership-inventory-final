import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VehicleFormModal from './VehicleFormModal.jsx';

describe('VehicleFormModal', () => {
  it('renders form elements for adding a new vehicle', () => {
    render(<VehicleFormModal isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} />);

    expect(screen.getByText(/add new vehicle/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/make/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/model/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/year/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/quantity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save|create/i })).toBeInTheDocument();
  });

  it('pre-fills form elements when vehicle prop is passed for editing', () => {
    const existingVehicle = {
      _id: '123',
      make: 'Ford',
      model: 'Mustang',
      year: 2022,
      price: 35000,
      quantity: 5,
      category: 'coupe',
    };

    render(
      <VehicleFormModal
        isOpen={true}
        vehicle={existingVehicle}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.getByText(/edit vehicle/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/make/i)).toHaveValue('Ford');
    expect(screen.getByLabelText(/model/i)).toHaveValue('Mustang');
    expect(screen.getByLabelText(/year/i)).toHaveValue(2022);
    expect(screen.getByLabelText(/price/i)).toHaveValue(35000);
    expect(screen.getByLabelText(/quantity/i)).toHaveValue(5);
  });

  it('submits form with correct form data', async () => {
    const mockOnSubmit = vi.fn();
    render(<VehicleFormModal isOpen={true} onClose={vi.fn()} onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByLabelText(/make/i), { target: { value: 'Chevrolet' } });
    fireEvent.change(screen.getByLabelText(/model/i), { target: { value: 'Corvette' } });
    fireEvent.change(screen.getByLabelText(/year/i), { target: { value: '2023' } });
    fireEvent.change(screen.getByLabelText(/price/i), { target: { value: '65000' } });
    fireEvent.change(screen.getByLabelText(/quantity/i), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'coupe' } });

    fireEvent.click(screen.getByRole('button', { name: /save|create/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        make: 'Chevrolet',
        model: 'Corvette',
        year: 2023,
        price: 65000,
        quantity: 2,
        category: 'coupe',
      });
    });
  });
});
