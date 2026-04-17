import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { TravelerProfileFormPage } from '@/features/traveler-profile';

const { mockGetQuery, mockPatchMutation } = vi.hoisted(() => ({
  mockGetQuery: vi.fn(),
  mockPatchMutation: vi.fn(),
}));

vi.mock('@/lib/trpc', () => ({
  trpc: {
    useUtils: () => ({
      travelerProfile: {
        get: { invalidate: vi.fn() },
      },
    }),
    travelerProfile: {
      get: { useQuery: mockGetQuery },
      patch: { useMutation: mockPatchMutation },
    },
  },
}));

describe('TravelerProfileFormPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockGetQuery.mockReturnValue({
      data: { preferences: {}, tier1Complete: false },
      isLoading: false,
    });
    mockPatchMutation.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      isSuccess: false,
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should have no serious accessibility violations on the first wizard step', async () => {
    const { container } = render(<TravelerProfileFormPage />);

    expect(
      await screen.findByRole('heading', { name: /Food & Diet/i }),
    ).toBeInTheDocument();

    expect(await axe(container)).toHaveNoViolations();
  });
});
