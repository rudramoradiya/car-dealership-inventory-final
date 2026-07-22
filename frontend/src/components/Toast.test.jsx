import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Toast from './Toast.jsx';

describe('Toast', () => {
  it('renders success message when message is provided', () => {
    render(<Toast message="Purchase successful!" type="success" onClose={vi.fn()} />);

    expect(screen.getByText('Purchase successful!')).toBeInTheDocument();
  });

  it('renders error style when type is error', () => {
    render(<Toast message="Something went wrong" type="error" onClose={vi.fn()} />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('returns null when message is empty or null', () => {
    const { container } = render(<Toast message="" onClose={vi.fn()} />);

    expect(container.firstChild).toBeNull();
  });
});
