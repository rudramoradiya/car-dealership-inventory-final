import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VehicleSearchFilter from './VehicleSearchFilter.jsx';

describe('VehicleSearchFilter', () => {
  it('renders filter form fields', () => {
    render(<VehicleSearchFilter onSearch={vi.fn()} onReset={vi.fn()} />);

    expect(screen.getByPlaceholderText(/search make/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search model/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/min price/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/max price/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search|filter/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset|clear/i })).toBeInTheDocument();
  });

  it('calls onSearch with filter params when submitted', () => {
    const mockOnSearch = vi.fn();
    render(<VehicleSearchFilter onSearch={mockOnSearch} onReset={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText(/search make/i), { target: { value: 'Honda' } });
    fireEvent.change(screen.getByPlaceholderText(/min price/i), { target: { value: '10000' } });
    fireEvent.click(screen.getByRole('button', { name: /search|filter/i }));

    expect(mockOnSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        make: 'Honda',
        minPrice: '10000',
      })
    );
  });

  it('clears form inputs and calls onReset when reset button clicked', () => {
    const mockOnReset = vi.fn();
    render(<VehicleSearchFilter onSearch={vi.fn()} onReset={mockOnReset} />);

    const makeInput = screen.getByPlaceholderText(/search make/i);
    fireEvent.change(makeInput, { target: { value: 'Honda' } });
    expect(makeInput.value).toBe('Honda');

    fireEvent.click(screen.getByRole('button', { name: /reset|clear/i }));

    expect(makeInput.value).toBe('');
    expect(mockOnReset).toHaveBeenCalled();
  });
});
