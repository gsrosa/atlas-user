import React from "react";

import { Button } from "@gsrosa/nexploring-ui";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CreditCardIcon,
  PlusIcon,
  SparklesIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { AccountSectionHeader } from "@/features/users/components/account-section-header";

import { trpc } from "@/trpc/client";

const PAGE_SIZE = 10;

function formatReason(reason: string): string {
  return reason.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function txType(
  amount: number,
  reason: string,
): "purchase" | "bonus" | "usage" {
  if (amount > 0 && reason.includes("topup")) return "purchase";
  if (amount > 0) return "bonus";
  return "usage";
}

export function PaymentsPage() {
  const { t, i18n } = useTranslation("profile");
  const [page, setPage] = React.useState(0);

  const balanceQuery = trpc.credits.balance.useQuery();
  const listQuery = trpc.credits.list.useQuery({ limit: PAGE_SIZE });

  const balance = balanceQuery.data?.balance ?? 0;
  const transactions = listQuery.data?.transactions ?? [];
  const total = listQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasPrev = page > 0;
  const hasNext = page < totalPages - 1;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(i18n.language, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const handleBuyCredits = () => {
    toast.message(t("billing.checkoutSoonToast"));
  };

  return (
    <div className="animate-account-fade-in-up space-y-10">
      <AccountSectionHeader
        icon={CreditCardIcon}
        title={t("section.billing")}
        description={t("billing.description")}
      />

      <div className="flex flex-col gap-4 rounded-2xl border border-neutral-700 bg-neutral-800 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-300 to-primary-500 text-neutral-700 shadow-[var(--atlas-shadow-md)]">
            <SparklesIcon className="size-5" strokeWidth={1.75} aria-hidden />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
              {t("billing.availableCredits")}
            </p>
            {balanceQuery.isLoading ? (
              <span className="mt-1 block h-8 w-12 animate-pulse rounded bg-neutral-700" />
            ) : (
              <p className="text-3xl font-bold tabular-nums text-neutral-100">
                {balance}
              </p>
            )}
          </div>
        </div>
        <Button
          type="button"
          variant="primary"
          className="w-full shrink-0 gap-2 rounded-full font-semibold sm:w-auto"
          onClick={handleBuyCredits}
        >
          <PlusIcon className="size-4" aria-hidden />
          {t("billing.buyCredits")}
        </Button>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-neutral-100">
          {t("billing.transactionHistory")}
        </h2>

        {listQuery.isLoading && (
          <ul className="space-y-3" aria-label={t("billing.loadingListAria")}>
            {Array.from({ length: 5 }).map((_, i) => (
              <li
                key={i}
                className="h-[72px] animate-pulse rounded-2xl bg-neutral-800"
              />
            ))}
          </ul>
        )}

        {listQuery.error && (
          <p className="text-sm text-red-400">{t("billing.loadFailedList")}</p>
        )}

        {!listQuery.isLoading &&
          !listQuery.error &&
          transactions.length === 0 && (
            <p className="text-sm text-neutral-400">{t("billing.emptyList")}</p>
          )}

        {!listQuery.isLoading &&
          !listQuery.error &&
          transactions.length > 0 && (
            <ul className="space-y-3">
              {transactions.map((tx) => {
                const type = txType(tx.amount, tx.reason);
                const creditsLabel =
                  tx.amount > 0
                    ? t("billing.creditsPositive", { count: tx.amount })
                    : t("billing.creditsNegative", { count: tx.amount });
                return (
                  <li
                    key={tx.id}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-neutral-700 bg-neutral-800 p-5 transition-colors hover:bg-neutral-700"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div
                        className={[
                          "flex size-9 shrink-0 items-center justify-center rounded-full",
                          type === "purchase"
                            ? "bg-auxiliary-500/15 text-auxiliary-500"
                            : type === "bonus"
                              ? "bg-primary-500/20 text-primary-500"
                              : "bg-neutral-700 text-neutral-400",
                        ].join(" ")}
                      >
                        <CreditCardIcon
                          className="size-4"
                          strokeWidth={1.75}
                          aria-hidden
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-neutral-100">
                          {formatReason(tx.reason)}
                        </p>
                        <p className="text-xs text-neutral-400">
                          {formatDate(tx.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p
                        className={
                          tx.amount > 0
                            ? "text-xs font-bold text-auxiliary-400"
                            : "text-xs font-bold text-primary-400"
                        }
                      >
                        {creditsLabel}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {t("billing.balanceAfterShort", {
                          count: tx.balance_after,
                        })}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

        <div className="flex items-center justify-between pt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!hasPrev}
            aria-label={t("billing.ariaPrevPage")}
            onClick={() => setPage((p) => p - 1)}
            className="gap-1"
          >
            <ChevronLeftIcon className="size-4" aria-hidden />
            {t("billing.paginationPrevious")}
          </Button>
          <span className="text-sm text-neutral-400">
            {t("billing.paginationPage", {
              current: page + 1,
              total: totalPages,
            })}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!hasNext}
            aria-label={t("billing.ariaNextPage")}
            onClick={() => setPage((p) => p + 1)}
            className="gap-1"
          >
            {t("billing.paginationNext")}
            <ChevronRightIcon className="size-4" aria-hidden />
          </Button>
        </div>
      </div>
    </div>
  );
}
