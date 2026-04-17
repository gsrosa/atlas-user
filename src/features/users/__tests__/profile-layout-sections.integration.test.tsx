import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Navigate, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ProfileLayout from '@/features/users/profile-layout';

vi.mock('@/providers/trpc-provider', () => ({
  TrpcProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('sonner', () => ({
  Toaster: () => null,
}));

const renderProfileRoutes = (initialPath: string) =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/profile" element={<ProfileLayout />}>
          <Route index element={<Navigate to="about" replace />} />
          <Route path="about" element={<div>About section content</div>} />
          <Route path="password" element={<div>Password section content</div>} />
          <Route path="preferences" element={<div>Preferences section content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

describe('ProfileLayout sections', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show the about outlet when the path is /profile/about', async () => {
    renderProfileRoutes('/profile/about');
    expect(await screen.findByText('About section content')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: /Account sections/i })).toBeInTheDocument();
  });

  it('should redirect from /profile to the about outlet', async () => {
    renderProfileRoutes('/profile');
    expect(await screen.findByText('About section content')).toBeInTheDocument();
  });

  it('should show the password outlet when the user opens the password nav link', async () => {
    const user = userEvent.setup();
    renderProfileRoutes('/profile/about');
    expect(await screen.findByText('About section content')).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: /^Password$/i }));

    await waitFor(() => {
      expect(screen.getByText('Password section content')).toBeInTheDocument();
    });
  });
});
