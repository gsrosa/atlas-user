import { z } from 'zod';

export const profileSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(120),
  last_name: z.string().min(1, 'Last name is required').max(120),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
  phone: z
    .string()
    .max(40, 'Phone must be 40 characters or less')
    .or(z.literal('')),
  bio: z
    .string()
    .max(2000, 'Bio must be 2000 characters or less')
    .or(z.literal('')),
  country: z
    .string()
    .length(2, 'Use a 2-letter ISO country code (e.g. US)')
    .or(z.literal('')),
  avatar_url: z.string().url('Must be a valid URL').max(2048).or(z.literal('')),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
