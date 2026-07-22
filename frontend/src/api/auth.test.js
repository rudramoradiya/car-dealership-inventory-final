import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getMe, login, register } from './auth.js';

vi.mock('./client.js', () => ({
  apiRequest: vi.fn(),
}));

import { apiRequest } from './client.js';

describe('auth API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('register should POST user credentials to /auth/register', async () => {
    const payload = { email: 'user@example.com', password: 'password123' };
    apiRequest.mockResolvedValue({ user: { email: payload.email } });

    const result = await register(payload);

    expect(apiRequest).toHaveBeenCalledWith('/auth/register', {
      method: 'POST',
      body: payload,
    });
    expect(result.user.email).toBe(payload.email);
  });

  it('login should POST credentials to /auth/login', async () => {
    const payload = { email: 'user@example.com', password: 'password123' };
    apiRequest.mockResolvedValue({ token: 'jwt-token', user: {} });

    const result = await login(payload);

    expect(apiRequest).toHaveBeenCalledWith('/auth/login', {
      method: 'POST',
      body: payload,
    });
    expect(result.token).toBe('jwt-token');
  });

  it('getMe should GET /auth/me with token', async () => {
    apiRequest.mockResolvedValue({ user: { email: 'user@example.com' } });

    const result = await getMe('jwt-token');

    expect(apiRequest).toHaveBeenCalledWith('/auth/me', { token: 'jwt-token' });
    expect(result.user.email).toBe('user@example.com');
  });
});
