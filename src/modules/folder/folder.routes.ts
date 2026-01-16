import { Router } from 'express';
import {
  getFolders,
  getFolderById,
  createFolder,
  updateFolder,
  deleteFolder,
  getFilesInFolder,
} from './folder.controller';
import { authenticate } from '../../shared/middleware';
import { validate } from '../../shared/middleware/validate';
import { createFolderSchema, updateFolderSchema } from './folder.validation';

const router = Router();

// Get all folders (with optional parentId filter)
router.get('/', authenticate, getFolders);

// Create a new folder
router.post('/', authenticate, validate(createFolderSchema), createFolder);

// Get a single folder by ID
router.get('/:id', authenticate, getFolderById);

// Update folder name
router.put('/:id', authenticate, validate(updateFolderSchema), updateFolder);

// Delete a folder
router.delete('/:id', authenticate, deleteFolder);

// Get all files in a folder
router.get('/:id/files', authenticate, getFilesInFolder);

export default router;
