export type ProfileSection = {
  index: number
  title: string
  subtitle: string
  icon: string
}

export type ProfileQuestionType = "single" | "scale" | "multi" | "discrete-slider" | "toggle"

export type ProfileOption = {
  value: string
  label: string
  /** Short text shown below the label on the tile. */
  description?: string
  /** Emoji shown large above the label on the tile. */
  emoji?: string
}

export type ProfileQuestion = {
  field: string
  sectionIndex: number
  sectionTitle: string
  title: string
  /** Short label used in the preferences summary view. */
  shortLabel: string
  subtitle?: string
  type: ProfileQuestionType
  options?: ProfileOption[]
  /** For scale / discrete-slider */
  minLabel?: string
  maxLabel?: string
  /** Decorative emoji shown above the question title for scale/slider steps. */
  stepEmoji?: string
}
