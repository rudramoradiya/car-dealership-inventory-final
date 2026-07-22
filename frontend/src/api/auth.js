import { apiRequest } from './client.js';

export function register(userData) {
  return apiRequest('/auth/register', { method: 'POST', body: userData });
}

export function login(credentials) {
  return apiRequest('/auth/login', { method: 'POST', body: credentials });
}

export function getMe(token) {
  return apiRequest('/auth/me', { token });
}
