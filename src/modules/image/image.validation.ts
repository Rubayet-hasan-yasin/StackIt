import { z } from 'zod';

// Preprocess to handle empty strings from form data
const preprocessString = (val: unknown) => {
  if (typeof val === 'string' && val.trim() === '') {
    return undefined;
  }
  return val;
};

export const uploadImageSchema = z.object({
  name: z.preprocess(
    preprocessString,
    z.string().min(1, 'Image name is required').max(200, 'Image name cannot exceed 200 characters')
  ),
  folderId: z.preprocess(preprocessString, z.string().optional()),
});

export type UploadImageDTO = z.infer<typeof uploadImageSchema>;
