import { cn } from "@gsrosa/atlas-ui"

type ScaleInputProps = {
  value: number | undefined
  minLabel?: string
  maxLabel?: string
  onChange: (n: number) => void
  className?: string
}

export const ScaleInput = ({ value, minLabel, maxLabel, onChange, className }: ScaleInputProps) => (
  <div className={cn("space-y-5", className)}>
    <div className="flex items-center justify-between font-sans text-xs text-neutral-400">
      <span>{minLabel}</span>
      <span>{maxLabel}</span>
    </div>
    <div className="flex items-center justify-center gap-3">
      {([1, 2, 3, 4, 5] as const).map((n) => {
        const sel = value === n
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-pressed={sel}
            className={cn(
              "flex size-10 items-center justify-center rounded-[var(--atlas-radius-lg)] border font-sans text-sm font-bold transition-colors duration-200",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 focus-visible:ring-offset-0",
              sel
                ? "scale-105 border-primary-500 bg-primary-500 text-white shadow-[var(--atlas-shadow-sm)]"
                : "border-neutral-700 bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100",
            )}
          >
            {n}
          </button>
        )
      })}
    </div>
  </div>
)
