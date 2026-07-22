import request from 'supertest';
import app from '../src/app.js';
import User from '../src/models/User.js';
import Vehicle from '../src/models/Vehicle.js';

const seedVehicle = {
  make: 'Toyota',
  model: 'Camry',
  category: 'sedan',
  year: 2024,
  price: 28000,
  quantity: 2,
};

async function registerUser({ email, password, role = 'user' }) {
  await request(app).post('/api/auth/register').send({ email, password });

  if (role === 'admin') {
    await User.findOneAndUpdate({ email }, { role: 'admin' });
  }

  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({ email, password });

  return loginResponse.body.token;
}

describe('POST /api/vehicles/:id/restock', () => {
  let vehicleId;
  let adminToken;

  beforeEach(async () => {
    adminToken = await registerUser({
      email: 'admin-restock@example.com',
      password: 'password123',
      role: 'admin',
    });

    const vehicle = await Vehicle.create(seedVehicle);
    vehicleId = vehicle._id.toString();
  });

  it('should allow an admin to restock a vehicle and return 200', async () => {
    const response = await request(app)
      .post(`/api/vehicles/${vehicleId}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ amount: 5 });

    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/restock/i);
    expect(response.body.vehicle.quantity).toBe(7);

    const updated = await Vehicle.findById(vehicleId);
    expect(updated.quantity).toBe(7);
  });

  it('should restock an out-of-stock vehicle', async () => {
    await Vehicle.findByIdAndUpdate(vehicleId, { quantity: 0 });

    const response = await request(app)
      .post(`/api/vehicles/${vehicleId}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ amount: 3 });

    expect(response.status).toBe(200);
    expect(response.body.vehicle.quantity).toBe(3);
  });

  it('should return 403 when a non-admin user tries to restock', async () => {
    const userToken = await registerUser({
      email: 'user-restock@example.com',
      password: 'password123',
    });

    const response = await request(app)
      .post(`/api/vehicles/${vehicleId}/restock`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ amount: 5 });

    expect(response.status).toBe(403);
    expect(response.body.message).toMatch(/admin/i);
  });

  it('should return 401 when no token is provided', async () => {
    const response = await request(app)
      .post(`/api/vehicles/${vehicleId}/restock`)
      .send({ amount: 5 });

    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/authentication/i);
  });

  it('should return 404 when the vehicle does not exist', async () => {
    const missingId = '507f1f77bcf86cd799439011';

    const response = await request(app)
      .post(`/api/vehicles/${missingId}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ amount: 5 });

    expect(response.status).toBe(404);
    expect(response.body.message).toMatch(/not found/i);
  });

  it('should return 400 for an invalid vehicle ID', async () => {
    const response = await request(app)
      .post('/api/vehicles/not-a-valid-id/restock')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ amount: 5 });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/invalid/i);
  });

  it('should return 400 when amount is missing', async () => {
    const response = await request(app)
      .post(`/api/vehicles/${vehicleId}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/amount/i);
  });

  it('should return 400 when amount is not a positive integer', async () => {
    const response = await request(app)
      .post(`/api/vehicles/${vehicleId}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ amount: -3 });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/positive/i);
  });
});
