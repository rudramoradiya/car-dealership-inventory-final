import request from 'supertest';
import bcrypt from 'bcrypt';
import app from '../src/app.js';
import User from '../src/models/User.js';

const validUser = {
  email: 'user@example.com',
  password: 'password123',
};

describe('POST /api/auth/register', () => {
  it('should register a new user and return 201 without password', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send(validUser);

    expect(response.status).toBe(201);
    expect(response.body.user).toBeDefined();
    expect(response.body.user.email).toBe(validUser.email);
    expect(response.body.user.password).toBeUndefined();
    expect(response.body.user._id).toBeDefined();
    expect(response.body.user.role).toBe('user');
  });

  it('should store a bcrypt-hashed password in the database', async () => {
    await request(app).post('/api/auth/register').send(validUser);

    const user = await User.findOne({ email: validUser.email }).select('+password');

    expect(user.password).not.toBe(validUser.password);
    expect(await bcrypt.compare(validUser.password, user.password)).toBe(true);
  });

  it('should reject duplicate email with 409', async () => {
    await request(app).post('/api/auth/register').send(validUser);

    const response = await request(app)
      .post('/api/auth/register')
      .send(validUser);

    expect(response.status).toBe(409);
    expect(response.body.message).toMatch(/email/i);
  });

  it('should return 400 when email or password is missing', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ email: 'incomplete@example.com' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBeDefined();
  });

  it('should return 400 when password length is less than 6 characters', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ email: 'shortpw@example.com', password: 'test1' });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/password must be at least 6 characters/i);
  });
});
