import { Router } from 'express';
import { getFiles, getFileById, deleteFile } from './file.controller';
import { authenticate } from '../../shared/middleware';
import { searchFiles } from '../dashboard/dashboard.controller';

const router = Router();

// Get all files (with optional filters via query params)
router.get('/', authenticate, getFiles);

// Get recent files
router.get('/recent', authenticate, async (req, res) => {
  const { getRecentFiles } = await import('../dashboard/dashboard.controller');
  return getRecentFiles(req, res);
});

// Global search
router.get('/search', authenticate, searchFiles);

// Get a single file by ID
router.get('/:id', authenticate, getFileById);

// Delete a file by ID
router.delete('/:id', authenticate, deleteFile);

export default router;
