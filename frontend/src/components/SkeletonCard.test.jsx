import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SkeletonCard from './SkeletonCard.jsx';

describe('SkeletonCard', () => {
  it('renders loading skeleton layout with animation class', () => {
    const { container } = render(<SkeletonCard />);
    const animatedElements = container.querySelectorAll('.animate-pulse');
    expect(animatedElements.length).toBeGreaterThan(0);
  });
});
