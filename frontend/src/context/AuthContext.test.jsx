import { render, screen, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext.jsx';
import * as authApi from '../api/auth.js';

vi.mock('../api/auth.js');

function TestConsumer() {
  const { user, token, isAuthenticated, isAdmin, loading, error, login, register, logout } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
      <div data-testid="admin-status">{isAdmin ? 'Admin' : 'User'}</div>
      <div data-testid="user-email">{user?.email || 'No User'}</div>
      <div data-testid="token">{token || 'No Token'}</div>
      {error && <div data-testid="error">{error}</div>}
      <button onClick={() => login({ email: 'test@example.com', password: 'password' })}>Login</button>
      <button onClick={() => register({ email: 'new@example.com', password: 'password' })}>Register</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('provides default unauthenticated state when no token in localStorage', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    });
    expect(screen.getByTestId('user-email')).toHaveTextContent('No User');
    expect(screen.getByTestId('token')).toHaveTextContent('No Token');
  });

  it('loads user from token stored in localStorage on mount', async () => {
    localStorage.setItem('token', 'valid-jwt');
    authApi.getMe.mockResolvedValueOnce({ user: { email: 'admin@example.com', role: 'admin' } });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });

    expect(authApi.getMe).toHaveBeenCalledWith('valid-jwt');
    expect(screen.getByTestId('admin-status')).toHaveTextContent('Admin');
    expect(screen.getByTestId('user-email')).toHaveTextContent('admin@example.com');
  });

  it('clears token if getMe fails on mount', async () => {
    localStorage.setItem('token', 'invalid-token');
    authApi.getMe.mockRejectedValueOnce(new Error('Invalid token'));

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    });

    expect(localStorage.getItem('token')).toBeNull();
  });

  it('handles successful login', async () => {
    authApi.login.mockResolvedValueOnce({
      token: 'new-jwt-token',
      user: { email: 'user@example.com', role: 'user' },
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Login').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });

    expect(screen.getByTestId('user-email')).toHaveTextContent('user@example.com');
    expect(localStorage.getItem('token')).toBe('new-jwt-token');
  });

  it('handles successful registration', async () => {
    authApi.register.mockResolvedValueOnce({
      user: { email: 'new@example.com', role: 'user' },
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Register').click();
    });

    expect(authApi.register).toHaveBeenCalledWith({ email: 'new@example.com', password: 'password' });
  });

  it('handles logout', async () => {
    localStorage.setItem('token', 'existing-token');
    authApi.getMe.mockResolvedValueOnce({ user: { email: 'user@example.com', role: 'user' } });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });

    await act(async () => {
      screen.getByText('Logout').click();
    });

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    expect(localStorage.getItem('token')).toBeNull();
  });
});
