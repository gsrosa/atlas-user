import { Button } from "@gsrosa/nexploring-ui";
import {
  CalendarIcon,
  ChevronRightIcon,
  MapIcon,
  MapPinIcon,
  PlusIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { AccountSectionHeader } from "@/features/users/components/account-section-header";

import { trpc } from "@/trpc/client";

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function PlansPage() {
  const { t } = useTranslation("profile");
  const { data, isLoading, error } = trpc.plans.list.useQuery({ limit: 50 });
  const plans = data?.plans;

  function handleNewPlan() {
    window.location.assign("/assistant");
  }

  function handleOpenPlan(id: string) {
    window.location.assign(`/my-trips/${id}`);
  }

  return (
    <div className="animate-account-fade-in-up space-y-10">
      <AccountSectionHeader
        icon={MapIcon}
        title={t("plans.title")}
        description={t("plans.description")}
        action={
          <Button
            type="button"
            variant="primary"
            className="gap-2 rounded-full font-semibold"
            onClick={handleNewPlan}
          >
            <PlusIcon className="size-4" aria-hidden />
            {t("plans.newPlan")}
          </Button>
        }
      />

      {isLoading && (
        <ul className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <li
              key={i}
              className="h-20 animate-pulse rounded-xl bg-neutral-700"
            />
          ))}
        </ul>
      )}

      {error && <p className="text-sm text-red-500">{t("plans.loadFailed")}</p>}

      {!isLoading && !error && plans?.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <MapPinIcon
            className="size-10 text-neutral-400 opacity-40"
            strokeWidth={1.25}
            aria-hidden
          />
          <p className="text-sm text-neutral-400">{t("plans.empty")}</p>
          <button
            type="button"
            onClick={handleNewPlan}
            className="text-sm font-medium text-primary-400 hover:underline"
          >
            {t("plans.planATrip")}
          </button>
        </div>
      )}

      {!isLoading && !error && plans && plans.length > 0 && (
        <ul className="space-y-3">
          {plans.map((plan) => {
            const displayName =
              plan.title ??
              plan.ai_suggested_title ??
              plan.destination ??
              t("plans.untitledTrip");
            const subtitle =
              plan.title && plan.destination ? plan.destination : null;

            return (
              <li key={plan.id}>
                <button
                  type="button"
                  className="group flex w-full items-center justify-between gap-4 rounded-xl border border-surface-border bg-surface p-5 text-left transition-colors hover:bg-neutral-600"
                  onClick={() => handleOpenPlan(plan.id)}
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-300 to-primary-500 text-neutral-700 shadow-[var(--atlas-shadow-sm)]">
                      <MapPinIcon
                        className="size-5"
                        strokeWidth={1.75}
                        aria-hidden
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-neutral-100">
                        {displayName}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                        {subtitle && (
                          <span className="truncate text-xs text-neutral-400">
                            {subtitle}
                          </span>
                        )}
                        {plan.departure_at && (
                          <span className="flex items-center gap-1 text-xs text-neutral-400">
                            <CalendarIcon
                              className="size-3 shrink-0"
                              aria-hidden
                            />
                            {formatDate(plan.departure_at)}
                          </span>
                        )}
                        {plan.days_count && (
                          <span className="text-xs text-neutral-400">
                            {t("plans.days", { count: plan.days_count })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronRightIcon
                    className="size-4 shrink-0 text-neutral-400 transition-colors group-hover:text-primary-400"
                    aria-hidden
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
