import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Navbar from './Navbar.jsx';
import { useAuth } from '../context/AuthContext.jsx';

vi.mock('../context/AuthContext.jsx');

describe('Navbar', () => {
  it('renders branding and guest links when unauthenticated', () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      isAdmin: false,
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText(/car dealership/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /register/i })).toBeInTheDocument();
  });

  it('renders user details and logout button when authenticated', () => {
    const mockLogout = vi.fn();
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { email: 'user@dealership.com', role: 'user' },
      isAdmin: false,
      logout: mockLogout,
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('user@dealership.com')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
    const logoutBtn = screen.getByRole('button', { name: /logout/i });
    expect(logoutBtn).toBeInTheDocument();

    fireEvent.click(logoutBtn);
    expect(mockLogout).toHaveBeenCalled();
  });

  it('displays Admin badge for admin user', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { email: 'admin@dealership.com', role: 'admin' },
      isAdmin: true,
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('Admin')).toBeInTheDocument();
  });
});
