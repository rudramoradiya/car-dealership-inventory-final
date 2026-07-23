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
      token: 'mock-token',
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

  // Covers fetchVehicles catch branch with specific error message and error alert rendering
  it('shows an error message when the initial fetch fails with an error message', async () => {
    vehiclesApi.listVehicles.mockRejectedValueOnce(new Error('Network down'));

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Network down')).toBeInTheDocument();
    });
  });

  // Covers fetchVehicles catch branch fallback message when error object has no message property
  it('falls back to a default error message when the fetch error has none', async () => {
    vehiclesApi.listVehicles.mockRejectedValueOnce({});

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch vehicles')).toBeInTheDocument();
    });
  });

  // Covers handleSearch catch branch when searchVehicles rejects
  it('shows an error message when search fails', async () => {
    vehiclesApi.listVehicles.mockResolvedValueOnce({ vehicles: sampleVehicles });
    vehiclesApi.searchVehicles.mockRejectedValueOnce(new Error('Search failed hard'));

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
      expect(screen.getByText('Search failed hard')).toBeInTheDocument();
    });
  });

  // Covers handleReset triggered from the empty state reset button
  it('resets back to the full list from the empty state', async () => {
    vehiclesApi.listVehicles
      .mockResolvedValueOnce({ vehicles: [] })
      .mockResolvedValueOnce({ vehicles: sampleVehicles });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/no vehicles found/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /reset filters/i }));

    await waitFor(() => {
      expect(screen.getByText(/Ford Mustang/i)).toBeInTheDocument();
    });

    expect(vehiclesApi.listVehicles).toHaveBeenCalledTimes(2);
  });

  // Covers isAdmin header rendering branch for + Add Vehicle button
  it('shows the Add Vehicle button for admin users', async () => {
    useAuth.mockReturnValue({
      token: 'admin-token',
      isAuthenticated: true,
      user: { email: 'admin@example.com', role: 'admin' },
      isAdmin: true,
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

    expect(screen.getByRole('button', { name: /\+ Add Vehicle/i })).toBeInTheDocument();
  });

  // Covers handlePurchase success flow with custom response message & refetch
  it('triggers purchaseVehicle when user clicks purchase button and shows success toast', async () => {
    vehiclesApi.listVehicles.mockResolvedValue({ vehicles: sampleVehicles });
    vehiclesApi.purchaseVehicle.mockResolvedValueOnce({
      message: 'Successfully purchased Ford Mustang!',
      vehicle: { ...sampleVehicles[0], quantity: 1 },
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Ford Mustang/i)).toBeInTheDocument();
    });

    const purchaseButtons = screen.getAllByRole('button', { name: /^Purchase$/i });
    fireEvent.click(purchaseButtons[0]);

    await waitFor(() => {
      expect(vehiclesApi.purchaseVehicle).toHaveBeenCalledWith('1', 'mock-token');
      expect(screen.getByText('Successfully purchased Ford Mustang!')).toBeInTheDocument();
    });
  });

  // Covers handlePurchase catch branch when purchase fails
  it('shows error toast when purchaseVehicle API call fails', async () => {
    vehiclesApi.listVehicles.mockResolvedValueOnce({ vehicles: sampleVehicles });
    vehiclesApi.purchaseVehicle.mockRejectedValueOnce(new Error('Out of stock'));

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Ford Mustang/i)).toBeInTheDocument();
    });

    const purchaseButtons = screen.getAllByRole('button', { name: /^Purchase$/i });
    fireEvent.click(purchaseButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Out of stock')).toBeInTheDocument();
    });
  });

  // Covers handleOpenAddModal, handleFormSubmit creation path, and closing modal
  it('allows admin to open add modal and create a vehicle', async () => {
    useAuth.mockReturnValue({
      token: 'admin-token',
      isAuthenticated: true,
      user: { email: 'admin@example.com', role: 'admin' },
      isAdmin: true,
    });

    vehiclesApi.listVehicles.mockResolvedValue({ vehicles: sampleVehicles });
    vehiclesApi.createVehicle.mockResolvedValueOnce({
      vehicle: { _id: '3', make: 'Chevrolet', model: 'Corvette', year: 2024, price: 65000, quantity: 1, category: 'coupe' },
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Ford Mustang/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /\+ Add Vehicle/i }));
    expect(screen.getByText(/Add New Vehicle/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Make/i), { target: { value: 'Chevrolet' } });
    fireEvent.change(screen.getByLabelText(/Model/i), { target: { value: 'Corvette' } });
    fireEvent.change(screen.getByLabelText(/Year/i), { target: { value: '2024' } });
    fireEvent.change(screen.getByLabelText(/Price/i), { target: { value: '65000' } });
    fireEvent.change(screen.getByLabelText(/Quantity/i), { target: { value: '1' } });

    fireEvent.click(screen.getByRole('button', { name: /Create Vehicle/i }));

    await waitFor(() => {
      expect(vehiclesApi.createVehicle).toHaveBeenCalledWith(
        expect.objectContaining({
          make: 'Chevrolet',
          model: 'Corvette',
          year: 2024,
          price: 65000,
          quantity: 1,
        }),
        'admin-token'
      );
      expect(screen.getByText('New vehicle created successfully!')).toBeInTheDocument();
    });
  });

  // Covers handleOpenEditModal, handleFormSubmit update path, and modal state
  it('allows admin to open edit modal and update an existing vehicle', async () => {
    useAuth.mockReturnValue({
      token: 'admin-token',
      isAuthenticated: true,
      user: { email: 'admin@example.com', role: 'admin' },
      isAdmin: true,
    });

    vehiclesApi.listVehicles.mockResolvedValue({ vehicles: sampleVehicles });
    vehiclesApi.updateVehicle.mockResolvedValueOnce({
      vehicle: { ...sampleVehicles[0], price: 38000 },
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Ford Mustang/i)).toBeInTheDocument();
    });

    const editButtons = screen.getAllByRole('button', { name: /Edit/i });
    fireEvent.click(editButtons[0]);

    expect(screen.getByText('Edit Vehicle')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/Price/i), { target: { value: '38000' } });

    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

    await waitFor(() => {
      expect(vehiclesApi.updateVehicle).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({ price: 38000 }),
        'admin-token'
      );
      expect(screen.getByText('Vehicle updated successfully!')).toBeInTheDocument();
    });
  });

  // Covers handleFormSubmit catch branch when create or update API call fails
  it('shows error toast when saving vehicle fails in form submit', async () => {
    useAuth.mockReturnValue({
      token: 'admin-token',
      isAuthenticated: true,
      user: { email: 'admin@example.com', role: 'admin' },
      isAdmin: true,
    });

    vehiclesApi.listVehicles.mockResolvedValueOnce({ vehicles: sampleVehicles });
    vehiclesApi.createVehicle.mockRejectedValueOnce(new Error('Validation error'));

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Ford Mustang/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /\+ Add Vehicle/i }));
    fireEvent.change(screen.getByLabelText(/Make/i), { target: { value: 'Ford' } });
    fireEvent.change(screen.getByLabelText(/Model/i), { target: { value: 'Focus' } });
    fireEvent.change(screen.getByLabelText(/Year/i), { target: { value: '2022' } });
    fireEvent.change(screen.getByLabelText(/Price/i), { target: { value: '20000' } });
    fireEvent.change(screen.getByLabelText(/Quantity/i), { target: { value: '3' } });

    fireEvent.click(screen.getByRole('button', { name: /Create Vehicle/i }));

    await waitFor(() => {
      expect(screen.getByText('Validation error')).toBeInTheDocument();
    });
  });

  // Covers handleOpenRestockModal, handleRestockSubmit, and RestockModal submit flow
  it('allows admin to open restock modal and restock vehicle inventory', async () => {
    useAuth.mockReturnValue({
      token: 'admin-token',
      isAuthenticated: true,
      user: { email: 'admin@example.com', role: 'admin' },
      isAdmin: true,
    });

    vehiclesApi.listVehicles.mockResolvedValue({ vehicles: sampleVehicles });
    vehiclesApi.restockVehicle.mockResolvedValueOnce({
      message: 'Restocked successfully',
      vehicle: { ...sampleVehicles[1], quantity: 5 },
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Tesla Model 3/i)).toBeInTheDocument();
    });

    const restockButtons = screen.getAllByRole('button', { name: /Restock/i });
    fireEvent.click(restockButtons[0]);

    expect(screen.getByText('Restock Vehicle')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Amount to Add/i), { target: { value: '5' } });
    const submitRestockButtons = screen.getAllByRole('button', { name: /^Restock$/i });
    fireEvent.click(submitRestockButtons[submitRestockButtons.length - 1]);

    await waitFor(() => {
      expect(vehiclesApi.restockVehicle).toHaveBeenCalledWith('1', 5, 'admin-token');
      expect(screen.getByText(/Restocked 5 units for Ford Mustang!/i)).toBeInTheDocument();
    });
  });

  // Covers handleRestockSubmit catch branch when restock API call fails
  it('shows error toast when restockVehicle fails', async () => {
    useAuth.mockReturnValue({
      token: 'admin-token',
      isAuthenticated: true,
      user: { email: 'admin@example.com', role: 'admin' },
      isAdmin: true,
    });

    vehiclesApi.listVehicles.mockResolvedValueOnce({ vehicles: sampleVehicles });
    vehiclesApi.restockVehicle.mockRejectedValueOnce(new Error('Restock failed'));

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Ford Mustang/i)).toBeInTheDocument();
    });

    const restockButtons = screen.getAllByRole('button', { name: /Restock/i });
    fireEvent.click(restockButtons[0]);

    const submitRestockButtons = screen.getAllByRole('button', { name: /^Restock$/i });
    fireEvent.click(submitRestockButtons[submitRestockButtons.length - 1]);

    await waitFor(() => {
      expect(screen.getByText('Restock failed')).toBeInTheDocument();
    });
  });

  // Covers handleDeleteVehicle cancel branch when user declines confirm dialog
  it('does not delete vehicle if user cancels window confirm dialog', async () => {
    useAuth.mockReturnValue({
      token: 'admin-token',
      isAuthenticated: true,
      user: { email: 'admin@example.com', role: 'admin' },
      isAdmin: true,
    });

    vehiclesApi.listVehicles.mockResolvedValueOnce({ vehicles: sampleVehicles });
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Ford Mustang/i)).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButtons[0]);

    expect(vehiclesApi.deleteVehicle).not.toHaveBeenCalled();
  });

  // Covers handleDeleteVehicle success branch when user confirms deletion
  it('allows admin to delete a vehicle after confirmation', async () => {
    useAuth.mockReturnValue({
      token: 'admin-token',
      isAuthenticated: true,
      user: { email: 'admin@example.com', role: 'admin' },
      isAdmin: true,
    });

    vehiclesApi.listVehicles.mockResolvedValue({ vehicles: sampleVehicles });
    vehiclesApi.deleteVehicle.mockResolvedValueOnce({ message: 'Vehicle deleted successfully' });
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Ford Mustang/i)).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(vehiclesApi.deleteVehicle).toHaveBeenCalledWith('1', 'admin-token');
      expect(screen.getByText('Ford Mustang deleted successfully.')).toBeInTheDocument();
    });
  });

  // Covers handleDeleteVehicle catch branch when delete API call fails
  it('shows error toast when deleteVehicle API call fails', async () => {
    useAuth.mockReturnValue({
      token: 'admin-token',
      isAuthenticated: true,
      user: { email: 'admin@example.com', role: 'admin' },
      isAdmin: true,
    });

    vehiclesApi.listVehicles.mockResolvedValueOnce({ vehicles: sampleVehicles });
    vehiclesApi.deleteVehicle.mockRejectedValueOnce(new Error('Delete restricted'));
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Ford Mustang/i)).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Delete restricted')).toBeInTheDocument();
    });
  });

  // Covers Toast onClose handler resetting toast state
  it('closes the toast notification when close button is clicked', async () => {
    vehiclesApi.listVehicles.mockResolvedValueOnce({ vehicles: sampleVehicles });
    vehiclesApi.purchaseVehicle.mockResolvedValueOnce({
      message: 'Purchase successful',
      vehicle: { ...sampleVehicles[0], quantity: 1 },
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Ford Mustang/i)).toBeInTheDocument();
    });

    const purchaseButtons = screen.getAllByRole('button', { name: /^Purchase$/i });
    fireEvent.click(purchaseButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Purchase successful')).toBeInTheDocument();
    });

    const toastCloseBtn = screen.getByRole('button', { name: '✕' });
    fireEvent.click(toastCloseBtn);

    expect(screen.queryByText('Purchase successful')).not.toBeInTheDocument();
  });

  // Covers VehicleFormModal onClose callback (Cancel button)
  it('closes VehicleFormModal when Cancel button is clicked', async () => {
    useAuth.mockReturnValue({
      token: 'admin-token',
      isAuthenticated: true,
      user: { email: 'admin@example.com', role: 'admin' },
      isAdmin: true,
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

    fireEvent.click(screen.getByRole('button', { name: /\+ Add Vehicle/i }));
    expect(screen.getByText('Add New Vehicle')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(screen.queryByText('Add New Vehicle')).not.toBeInTheDocument();
  });

  // Covers RestockModal onClose callback (Cancel button)
  it('closes RestockModal when Cancel button is clicked', async () => {
    useAuth.mockReturnValue({
      token: 'admin-token',
      isAuthenticated: true,
      user: { email: 'admin@example.com', role: 'admin' },
      isAdmin: true,
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

    const restockButtons = screen.getAllByRole('button', { name: /Restock/i });
    fireEvent.click(restockButtons[0]);
    expect(screen.getByText('Restock Vehicle')).toBeInTheDocument();

    const cancelButtons = screen.getAllByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelButtons[cancelButtons.length - 1]);
    expect(screen.queryByText('Restock Vehicle')).not.toBeInTheDocument();
  });
});
