import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/app.js';
import User from '../src/models/User.js';

const testUser = {
  email: 'middleware@example.com',
  password: 'password123',
};

async function registerAndLogin(user = testUser) {
  await request(app).post('/api/auth/register').send(user);
  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send(user);

  return loginResponse.body.token;
}

describe('Auth middleware', () => {
  describe('GET /api/auth/me', () => {
    it('should return 200 with the authenticated user when a valid JWT is provided', async () => {
      const token = await registerAndLogin();

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user.password).toBeUndefined();
      expect(response.body.user.role).toBe('user');
    });

    it('should return 401 when no Authorization header is provided', async () => {
      const response = await request(app).get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(/authentication/i);
    });

    it('should return 401 when the token is invalid', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(/invalid/i);
    });

    it('should return 401 when the token is expired', async () => {
      const token = await registerAndLogin();
      const expiredToken = jwt.sign(
        { id: '507f1f77bcf86cd799439011', email: testUser.email, role: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '-1s' }
      );

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(/invalid/i);
    });

    it('should return 401 when the user no longer exists', async () => {
      const token = await registerAndLogin();

      await User.deleteOne({ email: testUser.email });

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(/invalid/i);
    });
  });
});
