import type { ProfileQuestion } from "@/features/traveler-profile/shared/types"
import { TOGGLE_OPTIONS } from "@/features/traveler-profile/shared/constants"

import { ChipSelect } from "./chip-select"
import { ScaleInput } from "./scale-input"

type QuestionBlockProps = {
  step: ProfileQuestion
  value: unknown
  onChange: (value: unknown) => void
}

export const QuestionBlock = ({ step, value, onChange }: QuestionBlockProps) => {
  const scaleVal = typeof value === "number" ? value : undefined
  const singleVal = typeof value === "string" ? value : undefined
  const boolVal = typeof value === "boolean" ? value : undefined
  const multiVal = Array.isArray(value) ? (value as string[]) : []

  return (
    <div className="space-y-5">
      <h2 className="font-display text-lg font-medium leading-snug text-neutral-100/90">
        {step.title}
      </h2>

      {(step.type === "scale" || step.type === "discrete-slider") && (
        <ScaleInput
          value={scaleVal}
          minLabel={step.minLabel}
          maxLabel={step.maxLabel}
          onChange={onChange}
        />
      )}

      {step.type === "single" && step.options && (
        <ChipSelect
          options={step.options}
          selected={singleVal ? [singleVal] : []}
          onToggle={onChange}
        />
      )}

      {step.type === "toggle" && (
        <ChipSelect
          options={TOGGLE_OPTIONS}
          selected={boolVal === undefined ? [] : [String(boolVal)]}
          onToggle={(val) => onChange(val === "true")}
        />
      )}

      {step.type === "multi" && step.options && (
        <>
          <ChipSelect
            options={step.options}
            selected={multiVal}
            onToggle={(val) =>
              onChange(
                multiVal.includes(val)
                  ? multiVal.filter((v) => v !== val)
                  : [...multiVal, val],
              )
            }
          />
          <p className="font-sans text-xs text-neutral-400">Select all that apply</p>
        </>
      )}
    </div>
  )
}
