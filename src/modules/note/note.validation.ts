import { z } from 'zod';

export const createNoteSchema = z.object({
  name: z.string().min(1, 'Note name is required').max(200, 'Note name cannot exceed 200 characters'),
  content: z.string().optional().default(''),
  folderId: z.string().optional(),
});

export const updateNoteSchema = z.object({
  name: z.string().min(1, 'Note name is required').max(200, 'Note name cannot exceed 200 characters').optional(),
  content: z.string().optional(),
});

export type CreateNoteDTO = z.infer<typeof createNoteSchema>;
export type UpdateNoteDTO = z.infer<typeof updateNoteSchema>;
