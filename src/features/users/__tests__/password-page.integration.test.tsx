import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { trpc } from '@/lib/trpc';

import { PasswordPage } from '@/features/users/components/password-page';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@/lib/trpc', () => ({
  trpc: {
    useUtils: () => ({}),
    auth: {
      changePassword: {
        useMutation: vi.fn(),
      },
    },
  },
}));

describe('PasswordPage integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(trpc.auth.changePassword.useMutation).mockImplementation((opts) => ({
      mutate: vi.fn(() => {
        opts?.onSuccess?.();
      }),
      isPending: false,
    }) as unknown as ReturnType<typeof trpc.auth.changePassword.useMutation>);
  });

  it('should clear the password fields when the change succeeds', async () => {
    const user = userEvent.setup();
    render(<PasswordPage />);

    const current = screen.getByLabelText(/Current password/i);
    const next = screen.getByLabelText(/^New password$/i);
    const confirm = screen.getByLabelText(/Confirm new password/i);

    await user.type(current, 'OldPassword1');
    await user.type(next, 'NewPassword123');
    await user.type(confirm, 'NewPassword123');

    await user.click(screen.getByRole('button', { name: /Update password/i }));

    await waitFor(() => {
      expect(current).toHaveValue('');
      expect(next).toHaveValue('');
      expect(confirm).toHaveValue('');
    });
  });
});
