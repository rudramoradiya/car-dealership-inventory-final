import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VehicleCard from './VehicleCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

vi.mock('../context/AuthContext.jsx');

const sampleVehicle = {
  _id: 'v123',
  make: 'Toyota',
  model: 'Camry',
  year: 2022,
  price: 25000,
  quantity: 3,
  category: 'sedan',
  vin: 'TOY1234567890',
};

describe('VehicleCard', () => {
  it('renders vehicle information correctly', () => {
    useAuth.mockReturnValue({ isAuthenticated: true, user: { role: 'user' }, isAdmin: false });

    render(<VehicleCard vehicle={sampleVehicle} onPurchase={vi.fn()} />);

    expect(screen.getByText(/Toyota Camry/i)).toBeInTheDocument();
    expect(screen.getByText(/2022/i)).toBeInTheDocument();
    expect(screen.getByText(/\$25,000|\$25000/i)).toBeInTheDocument();
    expect(screen.getByText(/3 in stock/i)).toBeInTheDocument();
  });

  it('disables purchase button when vehicle is out of stock (quantity === 0)', () => {
    useAuth.mockReturnValue({ isAuthenticated: true, user: { role: 'user' }, isAdmin: false });
    const outOfStockVehicle = { ...sampleVehicle, quantity: 0 };

    render(<VehicleCard vehicle={outOfStockVehicle} onPurchase={vi.fn()} />);

    const purchaseBtn = screen.getByRole('button', { name: /purchase|out of stock/i });
    expect(purchaseBtn).toBeDisabled();
    expect(screen.getAllByText(/out of stock/i).length).toBeGreaterThan(0);
  });

  it('disables purchase button when user is unauthenticated', () => {
    useAuth.mockReturnValue({ isAuthenticated: false, user: null, isAdmin: false });

    render(<VehicleCard vehicle={sampleVehicle} onPurchase={vi.fn()} />);

    const purchaseBtn = screen.getByRole('button', { name: /login to purchase|purchase/i });
    expect(purchaseBtn).toBeDisabled();
  });

  it('calls onPurchase when purchase button is clicked by authenticated user', () => {
    useAuth.mockReturnValue({ isAuthenticated: true, user: { role: 'user' }, isAdmin: false });
    const mockOnPurchase = vi.fn();

    render(<VehicleCard vehicle={sampleVehicle} onPurchase={mockOnPurchase} />);

    const purchaseBtn = screen.getByRole('button', { name: /purchase/i });
    expect(purchaseBtn).not.toBeDisabled();
    fireEvent.click(purchaseBtn);

    expect(mockOnPurchase).toHaveBeenCalledWith(sampleVehicle);
  });
});
