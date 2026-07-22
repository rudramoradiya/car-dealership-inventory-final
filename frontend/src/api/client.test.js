import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiRequest } from './client.js';

describe('apiRequest', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('should send a GET request to the API base path', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'ok' }),
    });

    const data = await apiRequest('/health');

    expect(fetch).toHaveBeenCalledWith('/api/health', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: undefined,
    });
    expect(data).toEqual({ status: 'ok' });
  });

  it('should include Authorization header when a token is provided', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ user: {} }),
    });

    await apiRequest('/auth/me', { token: 'test-token' });

    expect(fetch).toHaveBeenCalledWith('/api/auth/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-token',
      },
      body: undefined,
    });
  });

  it('should send JSON body for POST requests', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ token: 'abc' }),
    });

    await apiRequest('/auth/login', {
      method: 'POST',
      body: { email: 'a@b.com', password: 'secret' },
    });

    expect(fetch).toHaveBeenCalledWith('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'a@b.com', password: 'secret' }),
    });
  });

  it('should throw an error with status when the response is not ok', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Authentication required' }),
    });

    await expect(apiRequest('/auth/me')).rejects.toMatchObject({
      message: 'Authentication required',
      status: 401,
    });
  });
});
