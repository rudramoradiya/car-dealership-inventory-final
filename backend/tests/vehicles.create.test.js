import request from 'supertest';
import app from '../src/app.js';
import User from '../src/models/User.js';

const validVehicle = {
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

describe('POST /api/vehicles', () => {
  it('should allow an admin to create a vehicle and return 201', async () => {
    const adminToken = await registerUser({
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    });

    const response = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(validVehicle);

    expect(response.status).toBe(201);
    expect(response.body.vehicle).toBeDefined();
    expect(response.body.vehicle.make).toBe(validVehicle.make);
    expect(response.body.vehicle.model).toBe(validVehicle.model);
    expect(response.body.vehicle.category).toBe(validVehicle.category);
    expect(response.body.vehicle.year).toBe(validVehicle.year);
    expect(response.body.vehicle.price).toBe(validVehicle.price);
    expect(response.body.vehicle.quantity).toBe(validVehicle.quantity);
    expect(response.body.vehicle._id).toBeDefined();
  });

  it('should return 403 when a non-admin user tries to create a vehicle', async () => {
    const userToken = await registerUser({
      email: 'user@example.com',
      password: 'password123',
    });

    const response = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${userToken}`)
      .send(validVehicle);

    expect(response.status).toBe(403);
    expect(response.body.message).toMatch(/admin/i);
  });

  it('should return 401 when no token is provided', async () => {
    const response = await request(app)
      .post('/api/vehicles')
      .send(validVehicle);

    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/authentication/i);
  });

  it('should return 400 when required fields are missing', async () => {
    const adminToken = await registerUser({
      email: 'admin-missing@example.com',
      password: 'password123',
      role: 'admin',
    });

    const response = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ make: 'Toyota' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBeDefined();
  });
});
