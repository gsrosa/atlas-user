import type { UserPreferencesFormValues } from "./schema"
import type { ProfileQuestion } from "./types"

export const canProceedSection = (
  steps: Pick<ProfileQuestion, "field" | "type">[],
  values: Partial<UserPreferencesFormValues>,
): boolean =>
  steps.every((step) => {
    const val = values[step.field as keyof UserPreferencesFormValues]
    if (step.type === "multi") return Array.isArray(val) && val.length > 0
    return val !== undefined && val !== null
  })
