import { z } from 'zod';

// Preprocess to handle empty strings from form data
const preprocessString = (val: unknown) => {
  if (typeof val === 'string' && val.trim() === '') {
    return undefined;
  }
  return val;
};

export const updateProfileSchema = z.object({
  name: z.preprocess(
    preprocessString,
    z.string().min(2, 'Name must be at least 2 characters long').max(50, 'Name cannot exceed 50 characters').optional()
  ),
});

export type UpdateUserProfileDTO = z.infer<typeof updateProfileSchema>;
