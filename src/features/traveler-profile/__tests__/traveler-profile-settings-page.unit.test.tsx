import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TravelerProfileSettingsPage } from '@/features/traveler-profile';

const { mockGetQuery } = vi.hoisted(() => ({
  mockGetQuery: vi.fn(),
}));

vi.mock('@/lib/trpc', () => ({
  trpc: {
    travelerProfile: {
      get: { useQuery: mockGetQuery },
    },
  },
}));

describe('TravelerProfileSettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have no serious accessibility violations when preferences are empty', async () => {
    mockGetQuery.mockReturnValue({
      data: { preferences: {} },
      isLoading: false,
    });

    const { container } = render(<TravelerProfileSettingsPage />);

    expect(await screen.findByRole('heading', { name: /Travel preferences/i })).toBeInTheDocument();
    expect(await screen.findByText(/No preferences saved yet/i)).toBeInTheDocument();

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no serious accessibility violations when preferences include values', async () => {
    mockGetQuery.mockReturnValue({
      data: {
        preferences: {
          diet: 'vegan',
          foodAdventurousness: 4,
          foodImportance: 3,
          drinksAlcohol: false,
        },
      },
      isLoading: false,
    });

    const { container } = render(<TravelerProfileSettingsPage />);

    expect(await screen.findByRole('heading', { name: /Travel preferences/i })).toBeInTheDocument();
    expect(await screen.findByText('Vegan')).toBeInTheDocument();

    expect(await axe(container)).toHaveNoViolations();
  });
});
