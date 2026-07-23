import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App.jsx';

describe('App', () => {
  it('redirects unauthenticated users to /login on root access', async () => {
    window.history.pushState({}, 'Test page', '/');
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /sign in to your account/i })).toBeInTheDocument();
    });
  });
});
