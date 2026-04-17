import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PreferencesPage } from '@/features/users/components/preferences-page';

vi.mock('@/features/traveler-profile', () => ({
  TravelerProfileFormPage: () => (
    <div role="region" aria-label="Traveler profile form">
      Form step
    </div>
  ),
  TravelerProfileSettingsPage: ({ onEdit }: { onEdit?: () => void }) => (
    <div>
      <p>Settings summary</p>
      <button type="button" onClick={onEdit}>
        Edit
      </button>
    </div>
  ),
}));

describe('PreferencesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show the traveler form when the user chooses edit', async () => {
    const user = userEvent.setup();
    render(<PreferencesPage />);

    expect(screen.getByText('Settings summary')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^Edit$/i }));

    expect(screen.getByRole('region', { name: /Traveler profile form/i })).toBeInTheDocument();
    expect(screen.queryByText('Settings summary')).not.toBeInTheDocument();
  });

  it('should return to settings when the traveler profile updated event fires', async () => {
    const user = userEvent.setup();
    render(<PreferencesPage />);

    await user.click(screen.getByRole('button', { name: /^Edit$/i }));
    expect(screen.getByRole('region', { name: /Traveler profile form/i })).toBeInTheDocument();

    window.dispatchEvent(new CustomEvent('atlas:traveler-profile-updated'));

    expect(await screen.findByText('Settings summary')).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: /Traveler profile form/i })).not.toBeInTheDocument();
  });
});
