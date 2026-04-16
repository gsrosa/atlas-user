import { cn } from "@gsrosa/atlas-ui"
import { CheckIcon } from "lucide-react"

import type { ProfileOption } from "@/features/traveler-profile/shared/types"

type ChipSelectProps = {
  options: ProfileOption[]
  selected: string[]
  onToggle: (value: string) => void
  className?: string
}

export const ChipSelect = ({ options, selected, onToggle, className }: ChipSelectProps) => (
  <div
    className={cn(
      "grid gap-3",
      options.length <= 4 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2 sm:grid-cols-3",
      className,
    )}
  >
    {options.map((opt) => {
      const active = selected.includes(opt.value)
      return (
        <button
          key={opt.value}
          type="button"
          onClick={() => onToggle(opt.value)}
          className={cn(
            "group relative flex min-h-[44px] items-start gap-3 rounded-[var(--atlas-radius-lg)] border p-4 text-left transition-colors duration-200",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 focus-visible:ring-offset-0",
            active
              ? "border-primary-500 bg-primary-500/10"
              : "border-neutral-700 bg-neutral-900 hover:bg-neutral-800",
          )}
        >
          <span
            className={cn(
              "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
              active ? "border-primary-500 bg-primary-500" : "border-neutral-400/30",
            )}
          >
            {active && <CheckIcon aria-hidden size={10} strokeWidth={3} className="text-white" />}
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              {opt.emoji && <span className="shrink-0 text-lg leading-none">{opt.emoji}</span>}
              <span
                className={cn(
                  "font-sans text-sm font-semibold transition-colors",
                  active ? "text-neutral-100" : "text-neutral-400 group-hover:text-neutral-100",
                )}
              >
                {opt.label}
              </span>
            </div>
            {opt.description && (
              <p className="mt-1 pl-7 text-xs text-neutral-400">{opt.description}</p>
            )}
          </div>
        </button>
      )
    })}
  </div>
)
