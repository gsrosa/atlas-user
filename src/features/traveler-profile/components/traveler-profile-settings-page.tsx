import { Button, cn } from "@gsrosa/nexploring-ui";
import { PencilIcon } from "lucide-react";

import { PROFILE_QUESTIONS } from "@/features/traveler-profile/shared/constants";
import type { ProfileQuestion } from "@/features/traveler-profile/shared/types";

import { trpc } from "@/trpc/client";

type StepValueProps = {
  step: ProfileQuestion;
  prefs: Record<string, unknown>;
};

const Unset = () => <span className="text-xs italic text-neutral-400">—</span>;

const SingleChip = ({ step, prefs }: StepValueProps) => {
  const raw = prefs[step.field];
  if (typeof raw !== "string") return <Unset />;
  const opt = step.options?.find((o) => o.value === raw);
  if (!opt) return <Unset />;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-700 bg-neutral-800 px-2.5 py-1 text-sm font-medium text-neutral-100">
      {opt.emoji && <span className="text-base leading-none">{opt.emoji}</span>}
      {opt.label}
    </span>
  );
};

const ScaleDots = ({ step, prefs }: StepValueProps) => {
  const raw = prefs[step.field];
  if (typeof raw !== "number") return <Unset />;
  return (
    <span className="inline-flex items-center gap-1">
      {([1, 2, 3, 4, 5] as const).map((n) => (
        <span
          key={n}
          className={cn(
            "size-2.5 rounded-full",
            n <= raw ? "bg-primary-500" : "bg-neutral-700",
          )}
        />
      ))}
      <span className="ml-1.5 text-xs text-neutral-400">{raw}/5</span>
    </span>
  );
};

const BoolBadge = ({ step, prefs }: StepValueProps) => {
  const raw = prefs[step.field];
  if (typeof raw !== "boolean") return <Unset />;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        raw
          ? "bg-primary-500/12 text-primary-500"
          : "bg-neutral-700 text-neutral-400",
      )}
    >
      {raw ? "Yes" : "No"}
    </span>
  );
};

const MultiChips = ({ step, prefs }: StepValueProps) => {
  const raw = prefs[step.field];
  const selected = Array.isArray(raw) ? (raw as string[]) : [];
  if (selected.length === 0) return <Unset />;
  return (
    <div className="flex max-w-full flex-wrap content-start gap-1.5">
      {selected.map((val) => {
        const opt = step.options?.find((o) => o.value === val);
        return (
          <span
            key={val}
            className="inline-flex max-w-full items-center gap-1 rounded-full bg-neutral-700 px-2 py-0.5 text-xs font-medium text-neutral-100"
          >
            {opt?.emoji && (
              <span className="shrink-0 leading-none">{opt.emoji}</span>
            )}
            <span className="min-w-0 truncate">{opt?.label ?? val}</span>
          </span>
        );
      })}
    </div>
  );
};

const FieldValue = ({ step, prefs }: StepValueProps) => {
  if (step.type === "single") return <SingleChip step={step} prefs={prefs} />;
  if (step.type === "scale" || step.type === "discrete-slider")
    return <ScaleDots step={step} prefs={prefs} />;
  if (step.type === "toggle") return <BoolBadge step={step} prefs={prefs} />;
  if (step.type === "multi") return <MultiChips step={step} prefs={prefs} />;
  return <Unset />;
};

// ─── Section grouping (module-level, no side-effects) ─────────────────────────

const buildSections = (): Map<string, ProfileQuestion[]> => {
  const map = new Map<string, ProfileQuestion[]>();
  for (const step of PROFILE_QUESTIONS) {
    const existing = map.get(step.sectionTitle);
    if (existing) {
      existing.push(step);
    } else {
      map.set(step.sectionTitle, [step]);
    }
  }
  return map;
};

const SECTIONS = buildSections();

// ─── Page ─────────────────────────────────────────────────────────────────────

type Props = { onEdit?: () => void };

export const TravelerProfileSettingsPage = ({ onEdit }: Props) => {
  const { data, isLoading } = trpc.travelerProfile.get.useQuery();

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-neutral-400">
        Loading…
      </div>
    );
  }

  const prefs = (data?.preferences ?? {}) as Record<string, unknown>;
  const hasAny = PROFILE_QUESTIONS.some(
    (s) => prefs[s.field] !== undefined && prefs[s.field] !== null,
  );

  return (
    <div className="animate-account-fade-in-up space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-neutral-100 sm:text-xl">
            Travel preferences
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Atlas uses these to personalise every trip plan to your style.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="inline-flex shrink-0 items-center gap-1.5"
          onClick={onEdit}
        >
          <PencilIcon aria-hidden size={13} strokeWidth={2} />
          Edit
        </Button>
      </div>

      {!hasAny && (
        <div className="rounded-2xl border border-neutral-700 px-5 py-10 text-center">
          <p className="text-sm text-neutral-400">No preferences saved yet.</p>
          <Button variant="primary" size="md" className="mt-4" onClick={onEdit}>
            Start quick setup
          </Button>
        </div>
      )}

      {hasAny && (
        <div className="rounded-2xl border border-neutral-700 px-5 py-5 sm:px-6">
          <div className="flex flex-col">
            {Array.from(SECTIONS.entries()).map(
              ([sectionTitle, steps], sectionIndex) => {
                const filled = steps.filter(
                  (s) =>
                    prefs[s.field] !== undefined && prefs[s.field] !== null,
                );
                if (filled.length === 0) return null;

                if (filled.length === 1) {
                  const step = filled[0];
                  return (
                    <div
                      key={sectionTitle}
                      className={cn(sectionIndex > 0 && "mt-8")}
                    >
                      <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary-500">
                        {sectionTitle}
                      </h2>
                      <div className="mt-2 flex max-w-full flex-wrap content-start items-center gap-2">
                        <FieldValue step={step} prefs={prefs} />
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={sectionTitle}
                    className={cn(sectionIndex > 0 && "mt-8")}
                  >
                    <h2 className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-primary-500">
                      {sectionTitle}
                    </h2>
                    <ul className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
                      {filled.map((step) => (
                        <li
                          key={step.field}
                          className="flex min-w-0 flex-col gap-1.5 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
                        >
                          <span className="shrink-0 text-xs font-medium text-neutral-300">
                            {step.shortLabel}
                          </span>
                          <div className="flex min-w-0 flex-1 justify-start sm:justify-end">
                            <FieldValue step={step} prefs={prefs} />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              },
            )}
          </div>
        </div>
      )}
    </div>
  );
};
