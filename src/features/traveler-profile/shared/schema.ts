import { z } from "zod"

export const travelerProfileFormSchema = z.object({
  diet: z.string().optional(),
  foodAdventurousness: z.number().min(1).max(5).optional(),
  foodImportance: z.number().min(1).max(5).optional(),
  drinksAlcohol: z.boolean().optional(),
  urbanVsNature: z.number().min(1).max(5).optional(),
  stimulationPreference: z.number().min(1).max(5).optional(),
  discoveryStyle: z.string().optional(),
  interests: z.array(z.string()).optional(),
  budgetStyle: z.string().optional(),
  fitnessLevel: z.string().optional(),
  languageComfort: z.string().optional(),
  tripMemorableBy: z.string().optional(),
})

export type TravelerProfileFormValues = z.infer<typeof travelerProfileFormSchema>
