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
  quantity: 5,
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

describe('DELETE /api/vehicles/:id', () => {
  let vehicleId;
  let adminToken;

  beforeEach(async () => {
    adminToken = await registerUser({
      email: 'admin-delete@example.com',
      password: 'password123',
      role: 'admin',
    });

    const vehicle = await Vehicle.create(seedVehicle);
    vehicleId = vehicle._id.toString();
  });

  it('should allow an admin to delete a vehicle and return 200', async () => {
    const response = await request(app)
      .delete(`/api/vehicles/${vehicleId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/deleted/i);

    const remaining = await Vehicle.findById(vehicleId);
    expect(remaining).toBeNull();
  });

  it('should return 403 when a non-admin user tries to delete', async () => {
    const userToken = await registerUser({
      email: 'user-delete@example.com',
      password: 'password123',
    });

    const response = await request(app)
      .delete(`/api/vehicles/${vehicleId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toMatch(/admin/i);

    const vehicle = await Vehicle.findById(vehicleId);
    expect(vehicle).not.toBeNull();
  });

  it('should return 401 when no token is provided', async () => {
    const response = await request(app).delete(`/api/vehicles/${vehicleId}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/authentication/i);
  });

  it('should return 404 when the vehicle does not exist', async () => {
    const missingId = '507f1f77bcf86cd799439011';

    const response = await request(app)
      .delete(`/api/vehicles/${missingId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toMatch(/not found/i);
  });

  it('should return 400 for an invalid vehicle ID', async () => {
    const response = await request(app)
      .delete('/api/vehicles/not-a-valid-id')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/invalid/i);
  });
});
