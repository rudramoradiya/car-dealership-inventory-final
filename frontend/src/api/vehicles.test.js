import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createVehicle,
  deleteVehicle,
  listVehicles,
  purchaseVehicle,
  restockVehicle,
  searchVehicles,
  updateVehicle,
} from './vehicles.js';

vi.mock('./client.js', () => ({
  apiRequest: vi.fn(),
}));

import { apiRequest } from './client.js';

const sampleVehicle = {
  make: 'Toyota',
  model: 'Camry',
  category: 'sedan',
  year: 2024,
  price: 28000,
  quantity: 5,
};

describe('vehicles API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('listVehicles should GET /vehicles', async () => {
    apiRequest.mockResolvedValue({ vehicles: [sampleVehicle] });

    const result = await listVehicles();

    expect(apiRequest).toHaveBeenCalledWith('/vehicles');
    expect(result.vehicles).toHaveLength(1);
  });

  it('searchVehicles should GET /vehicles/search with query params', async () => {
    apiRequest.mockResolvedValue({ vehicles: [] });

    await searchVehicles({ make: 'Toyota', minPrice: 20000, category: '' });

    expect(apiRequest).toHaveBeenCalledWith('/vehicles/search?make=Toyota&minPrice=20000');
  });

  it('createVehicle should POST to /vehicles with admin token', async () => {
    apiRequest.mockResolvedValue({ vehicle: sampleVehicle });

    await createVehicle(sampleVehicle, 'admin-token');

    expect(apiRequest).toHaveBeenCalledWith('/vehicles', {
      method: 'POST',
      body: sampleVehicle,
      token: 'admin-token',
    });
  });

  it('updateVehicle should PUT to /vehicles/:id with admin token', async () => {
    apiRequest.mockResolvedValue({ vehicle: { ...sampleVehicle, price: 27000 } });

    await updateVehicle('vehicle-id', { price: 27000 }, 'admin-token');

    expect(apiRequest).toHaveBeenCalledWith('/vehicles/vehicle-id', {
      method: 'PUT',
      body: { price: 27000 },
      token: 'admin-token',
    });
  });

  it('deleteVehicle should DELETE /vehicles/:id with admin token', async () => {
    apiRequest.mockResolvedValue({ message: 'Vehicle deleted successfully' });

    await deleteVehicle('vehicle-id', 'admin-token');

    expect(apiRequest).toHaveBeenCalledWith('/vehicles/vehicle-id', {
      method: 'DELETE',
      token: 'admin-token',
    });
  });

  it('purchaseVehicle should POST to /vehicles/:id/purchase with token', async () => {
    apiRequest.mockResolvedValue({ message: 'Purchase successful', vehicle: sampleVehicle });

    await purchaseVehicle('vehicle-id', 'user-token');

    expect(apiRequest).toHaveBeenCalledWith('/vehicles/vehicle-id/purchase', {
      method: 'POST',
      token: 'user-token',
    });
  });

  it('restockVehicle should POST to /vehicles/:id/restock with amount and admin token', async () => {
    apiRequest.mockResolvedValue({ message: 'Vehicle restocked successfully', vehicle: sampleVehicle });

    await restockVehicle('vehicle-id', 10, 'admin-token');

    expect(apiRequest).toHaveBeenCalledWith('/vehicles/vehicle-id/restock', {
      method: 'POST',
      body: { amount: 10 },
      token: 'admin-token',
    });
  });
});
