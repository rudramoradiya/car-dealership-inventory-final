import request from 'supertest';
import app from '../src/app.js';
import Vehicle from '../src/models/Vehicle.js';

const seedVehicles = [
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
    quantity: 3,
  },
  {
    make: 'Ford',
    model: 'F-150',
    category: 'truck',
    year: 2024,
    price: 45000,
    quantity: 2,
  },
  {
    make: 'Tesla',
    model: 'Model 3',
    category: 'sedan',
    year: 2024,
    price: 42000,
    quantity: 0,
  },
];

describe('GET /api/vehicles/search', () => {
  beforeEach(async () => {
    await Vehicle.create(seedVehicles);
  });

  it('should return all vehicles when no filters are provided', async () => {
    const response = await request(app).get('/api/vehicles/search');

    expect(response.status).toBe(200);
    expect(response.body.vehicles).toHaveLength(4);
  });

  it('should filter by make (case-insensitive partial match)', async () => {
    const response = await request(app).get('/api/vehicles/search').query({ make: 'toy' });

    expect(response.status).toBe(200);
    expect(response.body.vehicles).toHaveLength(1);
    expect(response.body.vehicles[0].make).toBe('Toyota');
  });

  it('should filter by model (case-insensitive partial match)', async () => {
    const response = await request(app).get('/api/vehicles/search').query({ model: 'civ' });

    expect(response.status).toBe(200);
    expect(response.body.vehicles).toHaveLength(1);
    expect(response.body.vehicles[0].model).toBe('Civic');
  });

  it('should filter by category', async () => {
    const response = await request(app).get('/api/vehicles/search').query({ category: 'sedan' });

    expect(response.status).toBe(200);
    expect(response.body.vehicles).toHaveLength(3);
    expect(response.body.vehicles.every((vehicle) => vehicle.category === 'sedan')).toBe(true);
  });

  it('should filter by minPrice', async () => {
    const response = await request(app).get('/api/vehicles/search').query({ minPrice: 40000 });

    expect(response.status).toBe(200);
    expect(response.body.vehicles).toHaveLength(2);
    expect(response.body.vehicles.every((vehicle) => vehicle.price >= 40000)).toBe(true);
  });

  it('should filter by maxPrice', async () => {
    const response = await request(app).get('/api/vehicles/search').query({ maxPrice: 30000 });

    expect(response.status).toBe(200);
    expect(response.body.vehicles).toHaveLength(2);
    expect(response.body.vehicles.every((vehicle) => vehicle.price <= 30000)).toBe(true);
  });

  it('should filter by price range', async () => {
    const response = await request(app)
      .get('/api/vehicles/search')
      .query({ minPrice: 25000, maxPrice: 43000 });

    expect(response.status).toBe(200);
    expect(response.body.vehicles).toHaveLength(2);
    expect(response.body.vehicles.map((vehicle) => vehicle.make).sort()).toEqual(['Tesla', 'Toyota']);
  });

  it('should combine multiple filters', async () => {
    const response = await request(app)
      .get('/api/vehicles/search')
      .query({ category: 'sedan', maxPrice: 30000 });

    expect(response.status).toBe(200);
    expect(response.body.vehicles).toHaveLength(2);
    expect(response.body.vehicles.map((vehicle) => vehicle.make).sort()).toEqual(['Honda', 'Toyota']);
  });

  it('should return an empty array when no vehicles match', async () => {
    const response = await request(app)
      .get('/api/vehicles/search')
      .query({ make: 'BMW' });

    expect(response.status).toBe(200);
    expect(response.body.vehicles).toEqual([]);
  });

  it('should include out-of-stock vehicles in search results', async () => {
    const response = await request(app)
      .get('/api/vehicles/search')
      .query({ make: 'Tesla' });

    expect(response.status).toBe(200);
    expect(response.body.vehicles).toHaveLength(1);
    expect(response.body.vehicles[0].quantity).toBe(0);
  });

  it('should not require authentication', async () => {
    const response = await request(app).get('/api/vehicles/search').query({ category: 'truck' });

    expect(response.status).toBe(200);
    expect(response.body.vehicles).toHaveLength(1);
    expect(response.body.vehicles[0].make).toBe('Ford');
  });
});
