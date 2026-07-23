import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RegisterPage from './RegisterPage.jsx';
import { useAuth } from '../context/AuthContext.jsx';

vi.mock('../context/AuthContext.jsx');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('RegisterPage', () => {
  const mockRegister = vi.fn();
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      register: mockRegister,
      login: mockLogin,
      loading: false,
      error: null,
      isAuthenticated: false,
    });
  });

  it('renders registration form elements', () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register|sign up/i })).toBeInTheDocument();
  });

  it('submits form with user email and password', async () => {
    mockRegister.mockResolvedValueOnce();
    mockLogin.mockResolvedValueOnce();

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'newuser@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /register|sign up/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        email: 'newuser@example.com',
        password: 'password123',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('displays error message on registration failure', async () => {
    mockRegister.mockRejectedValueOnce(new Error('Email already registered'));

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'existing@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /register|sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/email already registered/i)).toBeInTheDocument();
    });
  });

  it('displays validation error when password length is less than 6 characters', async () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'test1' } });
    fireEvent.click(screen.getByRole('button', { name: /register|sign up/i }));

    await waitFor(() => {
      expect(screen.getAllByText(/password must be at least 6 characters long/i).length).toBeGreaterThan(0);
    });
    expect(mockRegister).not.toHaveBeenCalled();
  });
});
