import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PasswordPage } from '@/features/users/components/password-page';
import * as usePasswordFormModule from '@/features/users/hooks/use-password-form';

vi.mock('@/features/users/hooks/use-password-form', () => ({
  usePasswordForm: vi.fn(),
}));

type PasswordFormHookValue = ReturnType<typeof usePasswordFormModule.usePasswordForm>;

describe('PasswordPage', () => {
  const mockOnSubmit = vi.fn();
  const mockRegister = vi.fn().mockImplementation((name: string) => ({
    name,
    onChange: vi.fn(),
    onBlur: vi.fn(),
    ref: vi.fn(),
  }));

  const defaultHookValue: PasswordFormHookValue = {
    form: {
      register: mockRegister,
      formState: { errors: {} },
    },
    isSubmitting: false,
    onSubmit: mockOnSubmit,
  } as unknown as PasswordFormHookValue;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePasswordFormModule.usePasswordForm).mockReturnValue(defaultHookValue);
  });

  it('should show password fields and submit when the form is idle', () => {
    render(<PasswordPage />);
    expect(screen.getByRole('heading', { name: /Password/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Current password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^New password$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Update password/i })).toBeInTheDocument();
  });

  it('should have no serious accessibility violations when the form is idle', async () => {
    const { container } = render(<PasswordPage />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
