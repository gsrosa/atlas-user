const DRAFT_KEY = "atlas.travelerOnboarding.v1"

export const loadDraft = (): Record<string, unknown> => {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Record<string, unknown>
  } catch {
    return {}
  }
}

export const saveDraft = (values: Record<string, unknown>): void => {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(values))
  } catch {
    // storage unavailable — silent fail
  }
}

export const clearDraft = (): void => {
  try {
    localStorage.removeItem(DRAFT_KEY)
  } catch {
    // silent fail
  }
}
