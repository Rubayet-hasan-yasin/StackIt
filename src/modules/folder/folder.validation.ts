import { z } from 'zod';

export const createFolderSchema = z.object({
  name: z.string().min(1, 'Folder name is required').max(100, 'Folder name cannot exceed 100 characters'),
  parentId: z.string().optional(),
});

export const updateFolderSchema = z.object({
  name: z.string().min(1, 'Folder name is required').max(100, 'Folder name cannot exceed 100 characters'),
});

export type CreateFolderDTO = z.infer<typeof createFolderSchema>;
export type UpdateFolderDTO = z.infer<typeof updateFolderSchema>;
