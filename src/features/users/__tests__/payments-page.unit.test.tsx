import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// ── Mocks ──────────────────────────────────────────────────────────────────

vi.mock('@/lib/trpc', () => ({
  trpc: {
    credits: {
      balance: { useQuery: vi.fn() },
      list: { useQuery: vi.fn() },
    },
  },
}));

vi.mock('@gsrosa/atlas-ui', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@gsrosa/atlas-ui')>();
  return {
    ...actual,
    Button: ({ children, onClick, disabled, ...props }: React.ComponentProps<'button'>) => (
      <button onClick={onClick} disabled={disabled} {...props}>{children}</button>
    ),
  };
});

vi.mock('sonner', () => ({ toast: { message: vi.fn() } }));

vi.mock('@/features/users/components/account-section-header', () => ({
  AccountSectionHeader: () => <div />,
}));

import { trpc } from '@/lib/trpc';
import { PaymentsPage } from '../components/payments-page';

// ── Helpers ────────────────────────────────────────────────────────────────

const mockBalance = trpc.credits.balance.useQuery as ReturnType<typeof vi.fn>;
const mockList = trpc.credits.list.useQuery as ReturnType<typeof vi.fn>;

const makeTx = (id: string, amount: number, reason = 'plan_generated') => ({
  id,
  user_id: 'u1',
  amount,
  balance_after: 10,
  reason,
  reference_type: null,
  reference_id: null,
  metadata: {},
  created_at: new Date('2026-03-25').toISOString(),
});

const defaultBalance = { data: { balance: 12 }, isLoading: false, error: null };
const emptyList = { data: { transactions: [], total: 0, page: 0, limit: 10 }, isLoading: false, error: null };

// ── Tests ──────────────────────────────────────────────────────────────────

describe('PaymentsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockBalance.mockReturnValue(defaultBalance);
    mockList.mockReturnValue(emptyList);
  });

  it('renders the available credit balance', () => {
    mockBalance.mockReturnValue({ data: { balance: 42 }, isLoading: false, error: null });
    render(<PaymentsPage />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('shows loading skeleton for balance', () => {
    mockBalance.mockReturnValue({ data: undefined, isLoading: true, error: null });
    render(<PaymentsPage />);
    // skeleton element is present; exact text is absent
    expect(screen.queryByText('12')).not.toBeInTheDocument();
  });

  it('shows loading skeleton for transaction list', () => {
    mockList.mockReturnValue({ data: undefined, isLoading: true, error: null });
    render(<PaymentsPage />);
    expect(screen.getAllByRole('listitem').length).toBeGreaterThan(0);
  });

  it('shows error message when list query fails', () => {
    mockList.mockReturnValue({ data: undefined, isLoading: false, error: new Error('fail') });
    render(<PaymentsPage />);
    expect(screen.getByText(/failed to load transactions/i)).toBeInTheDocument();
  });

  it('shows empty state when there are no transactions', () => {
    render(<PaymentsPage />);
    expect(screen.getByText(/no transactions yet/i)).toBeInTheDocument();
  });

  it('renders transaction rows', () => {
    mockList.mockReturnValue({
      data: {
        transactions: [makeTx('1', -5, 'plan_generated'), makeTx('2', 10, 'manual_topup')],
        total: 2,
        page: 0,
        limit: 10,
      },
      isLoading: false,
      error: null,
    });
    render(<PaymentsPage />);
    expect(screen.getByText('Plan Generated')).toBeInTheDocument();
    expect(screen.getByText('Manual Topup')).toBeInTheDocument();
    expect(screen.getByText('-5 credits')).toBeInTheDocument();
    expect(screen.getByText('+10 credits')).toBeInTheDocument();
  });

  it('renders pagination controls even when total fits on one page', () => {
    mockList.mockReturnValue({
      data: { transactions: [makeTx('1', -5)], total: 1, page: 0, limit: 10 },
      isLoading: false,
      error: null,
    });
    render(<PaymentsPage />);
    expect(screen.getByRole('button', { name: /previous page/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /next page/i })).toBeDisabled();
    expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
  });

  it('renders pagination when total exceeds one page', () => {
    mockList.mockReturnValue({
      data: {
        transactions: Array.from({ length: 10 }, (_, i) => makeTx(String(i), -1)),
        total: 25,
        page: 0,
        limit: 10,
      },
      isLoading: false,
      error: null,
    });
    render(<PaymentsPage />);
    expect(screen.getByRole('button', { name: /previous page/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /next page/i })).not.toBeDisabled();
    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
  });

  it('calls useQuery with incremented page when Next is clicked', async () => {
    const user = userEvent.setup();
    mockList.mockReturnValue({
      data: {
        transactions: Array.from({ length: 10 }, (_, i) => makeTx(String(i), -1)),
        total: 25,
        page: 0,
        limit: 10,
      },
      isLoading: false,
      error: null,
    });
    render(<PaymentsPage />);

    await user.click(screen.getByRole('button', { name: /next page/i }));

    await waitFor(() => {
      const calls = mockList.mock.calls;
      const lastCall = calls[calls.length - 1][0];
      expect(lastCall).toMatchObject({ limit: 10, page: 1 });
    });
  });

  it('calls useQuery with decremented page when Previous is clicked after advancing', async () => {
    const user = userEvent.setup();
    mockList.mockReturnValue({
      data: {
        transactions: Array.from({ length: 10 }, (_, i) => makeTx(String(i), -1)),
        total: 25,
        page: 0,
        limit: 10,
      },
      isLoading: false,
      error: null,
    });
    render(<PaymentsPage />);

    await user.click(screen.getByRole('button', { name: /next page/i }));
    await user.click(screen.getByRole('button', { name: /previous page/i }));

    await waitFor(() => {
      const calls = mockList.mock.calls;
      const lastCall = calls[calls.length - 1][0];
      expect(lastCall).toMatchObject({ limit: 10, page: 0 });
    });
  });
});
