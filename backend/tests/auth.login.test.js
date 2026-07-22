import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/app.js';

const validUser = {
  email: 'login@example.com',
  password: 'password123',
};

async function registerUser(user = validUser) {
  await request(app).post('/api/auth/register').send(user);
}

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await registerUser();
  });

  it('should return 200 with a JWT and user without password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send(validUser);

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.user).toBeDefined();
    expect(response.body.user.email).toBe(validUser.email);
    expect(response.body.user.password).toBeUndefined();

    const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET);
    expect(decoded.id).toBe(response.body.user._id);
    expect(decoded.email).toBe(validUser.email);
    expect(decoded.role).toBe('user');
  });

  it('should return 401 for an unregistered email', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'unknown@example.com', password: validUser.password });

    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/invalid/i);
  });

  it('should return 401 for an incorrect password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: 'wrongpassword' });

    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/invalid/i);
  });

  it('should return 400 when email or password is missing', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email });

    expect(response.status).toBe(400);
    expect(response.body.message).toBeDefined();
  });
});
