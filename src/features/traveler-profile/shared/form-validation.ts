import type { TravelerProfileFormValues } from "./schema"
import type { ProfileQuestion } from "./types"

export const canProceedSection = (
  steps: Pick<ProfileQuestion, "field" | "type">[],
  values: Partial<TravelerProfileFormValues>,
): boolean =>
  steps.every((step) => {
    const val = values[step.field as keyof TravelerProfileFormValues]
    if (step.type === "multi") return Array.isArray(val) && val.length > 0
    return val !== undefined && val !== null
  })
