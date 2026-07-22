import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RestockModal from './RestockModal.jsx';

describe('RestockModal', () => {
  it('renders restock input field and buttons', () => {
    render(<RestockModal isOpen={true} vehicleName="Toyota Camry" onClose={vi.fn()} onSubmit={vi.fn()} />);

    expect(screen.getByText(/restock vehicle/i)).toBeInTheDocument();
    expect(screen.getByText(/Toyota Camry/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /restock/i })).toBeInTheDocument();
  });

  it('submits restock amount when submitted', () => {
    const mockOnSubmit = vi.fn();
    render(<RestockModal isOpen={true} vehicleName="Toyota Camry" onClose={vi.fn()} onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '10' } });
    fireEvent.click(screen.getByRole('button', { name: /restock/i }));

    expect(mockOnSubmit).toHaveBeenCalledWith(10);
  });
});
