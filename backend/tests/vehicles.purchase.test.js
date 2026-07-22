import request from 'supertest';
import app from '../src/app.js';
import Vehicle from '../src/models/Vehicle.js';

const inStockVehicle = {
  make: 'Toyota',
  model: 'Camry',
  category: 'sedan',
  year: 2024,
  price: 28000,
  quantity: 3,
};

const outOfStockVehicle = {
  make: 'Honda',
  model: 'Civic',
  category: 'sedan',
  year: 2023,
  price: 24000,
  quantity: 0,
};

async function registerAndLogin(email = 'buyer@example.com') {
  await request(app)
    .post('/api/auth/register')
    .send({ email, password: 'password123' });

  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({ email, password: 'password123' });

  return loginResponse.body.token;
}

describe('POST /api/vehicles/:id/purchase', () => {
  let vehicleId;
  let userToken;

  beforeEach(async () => {
    userToken = await registerAndLogin();
    const vehicle = await Vehicle.create(inStockVehicle);
    vehicleId = vehicle._id.toString();
  });

  it('should allow an authenticated user to purchase and decrement quantity by 1', async () => {
    const response = await request(app)
      .post(`/api/vehicles/${vehicleId}/purchase`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/purchase/i);
    expect(response.body.vehicle.quantity).toBe(2);

    const updated = await Vehicle.findById(vehicleId);
    expect(updated.quantity).toBe(2);
  });

  it('should allow multiple purchases until stock runs out', async () => {
    await request(app)
      .post(`/api/vehicles/${vehicleId}/purchase`)
      .set('Authorization', `Bearer ${userToken}`);

    await request(app)
      .post(`/api/vehicles/${vehicleId}/purchase`)
      .set('Authorization', `Bearer ${userToken}`);

    const response = await request(app)
      .post(`/api/vehicles/${vehicleId}/purchase`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.vehicle.quantity).toBe(0);

    const outOfStockResponse = await request(app)
      .post(`/api/vehicles/${vehicleId}/purchase`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(outOfStockResponse.status).toBe(400);
    expect(outOfStockResponse.body.message).toMatch(/out of stock/i);
  });

  it('should return 400 when quantity is already 0', async () => {
    const vehicle = await Vehicle.create(outOfStockVehicle);

    const response = await request(app)
      .post(`/api/vehicles/${vehicle._id}/purchase`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/out of stock/i);
  });

  it('should return 401 when no token is provided', async () => {
    const response = await request(app)
      .post(`/api/vehicles/${vehicleId}/purchase`);

    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/authentication/i);
  });

  it('should return 404 when the vehicle does not exist', async () => {
    const missingId = '507f1f77bcf86cd799439011';

    const response = await request(app)
      .post(`/api/vehicles/${missingId}/purchase`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toMatch(/not found/i);
  });

  it('should return 400 for an invalid vehicle ID', async () => {
    const response = await request(app)
      .post('/api/vehicles/not-a-valid-id/purchase')
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/invalid/i);
  });
});
