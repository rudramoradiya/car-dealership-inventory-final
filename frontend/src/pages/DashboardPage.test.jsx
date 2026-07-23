import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DashboardPage from './DashboardPage.jsx';
import * as vehiclesApi from '../api/vehicles.js';
import { useAuth } from '../context/AuthContext.jsx';

vi.mock('../api/vehicles.js');
vi.mock('../context/AuthContext.jsx');

const sampleVehicles = [
  { _id: '1', make: 'Ford', model: 'Mustang', year: 2023, price: 35000, quantity: 2, category: 'coupe', vin: 'FORD1' },
  { _id: '2', make: 'Tesla', model: 'Model 3', year: 2024, price: 42000, quantity: 0, category: 'sedan', vin: 'TSLA2' },
];

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { email: 'user@example.com', role: 'user' },
      isAdmin: false,
    });
  });

  it('fetches and displays vehicles on mount', async () => {
    vehiclesApi.listVehicles.mockResolvedValueOnce({ vehicles: sampleVehicles });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Ford Mustang/i)).toBeInTheDocument();
      expect(screen.getByText(/Tesla Model 3/i)).toBeInTheDocument();
    });

    expect(vehiclesApi.listVehicles).toHaveBeenCalledTimes(1);
  });

  it('hides Add Vehicle button for standard user role', async () => {
    useAuth.mockReturnValue({
      token: 'user-token',
      isAuthenticated: true,
      user: { email: 'user@example.com', role: 'user' },
      isAdmin: false,
    });
    vehiclesApi.listVehicles.mockResolvedValueOnce({ vehicles: sampleVehicles });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Ford Mustang/i)).toBeInTheDocument();
    });

    expect(screen.queryByRole('button', { name: /\+ Add Vehicle/i })).not.toBeInTheDocument();
  });

  it('filters vehicles when search filter is applied', async () => {
    vehiclesApi.listVehicles.mockResolvedValueOnce({ vehicles: sampleVehicles });
    vehiclesApi.searchVehicles.mockResolvedValueOnce({ vehicles: [sampleVehicles[0]] });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Ford Mustang/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/search make/i), { target: { value: 'Ford' } });
    fireEvent.click(screen.getByRole('button', { name: /search|filter/i }));

    await waitFor(() => {
      expect(vehiclesApi.searchVehicles).toHaveBeenCalledWith(
        expect.objectContaining({ make: 'Ford' })
      );
      expect(screen.getByText(/Ford Mustang/i)).toBeInTheDocument();
      expect(screen.queryByText(/Tesla Model 3/i)).not.toBeInTheDocument();
    });
  });

  it('displays empty state message when no vehicles are found', async () => {
    vehiclesApi.listVehicles.mockResolvedValueOnce({ vehicles: [] });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/no vehicles found/i)).toBeInTheDocument();
    });
  });
});
