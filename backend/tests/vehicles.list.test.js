import request from 'supertest';
import app from '../src/app.js';
import Vehicle from '../src/models/Vehicle.js';

const vehicles = [
  {
    make: 'Toyota',
    model: 'Camry',
    category: 'sedan',
    year: 2024,
    price: 28000,
    quantity: 5,
  },
  {
    make: 'Honda',
    model: 'Civic',
    category: 'sedan',
    year: 2023,
    price: 24000,
    quantity: 0,
  },
];

describe('GET /api/vehicles', () => {
  it('should return 200 with an empty array when no vehicles exist', async () => {
    const response = await request(app).get('/api/vehicles');

    expect(response.status).toBe(200);
    expect(response.body.vehicles).toEqual([]);
  });

  it('should return all vehicles without authentication', async () => {
    await Vehicle.create(vehicles);

    const response = await request(app).get('/api/vehicles');

    expect(response.status).toBe(200);
    expect(response.body.vehicles).toHaveLength(2);
  });

  it('should include out-of-stock vehicles in the list', async () => {
    await Vehicle.create(vehicles);

    const response = await request(app).get('/api/vehicles');

    const outOfStock = response.body.vehicles.find(
      (vehicle) => vehicle.make === 'Honda' && vehicle.model === 'Civic'
    );

    expect(outOfStock).toBeDefined();
    expect(outOfStock.quantity).toBe(0);
  });

  it('should return complete vehicle inventory fields', async () => {
    await Vehicle.create(vehicles[0]);

    const response = await request(app).get('/api/vehicles');
    const vehicle = response.body.vehicles[0];

    expect(vehicle).toMatchObject({
      make: 'Toyota',
      model: 'Camry',
      category: 'sedan',
      year: 2024,
      price: 28000,
      quantity: 5,
    });
    expect(vehicle._id).toBeDefined();
  });
});
