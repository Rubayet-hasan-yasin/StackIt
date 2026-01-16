import { Router } from 'express';
import { getFiles, getFileById, deleteFile } from './file.controller';
import { authenticate } from '../../shared/middleware';

const router = Router();

// Get all files (with optional filters via query params)
router.get('/', authenticate, getFiles);

// Get a single file by ID
router.get('/:id', authenticate, getFileById);

// Delete a file by ID
router.delete('/:id', authenticate, deleteFile);

export default router;
