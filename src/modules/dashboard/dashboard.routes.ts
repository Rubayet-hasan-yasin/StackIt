import { Router } from 'express';
import { getDashboardSummary, getRecentFiles, searchFiles } from './dashboard.controller';
import { authenticate } from '../../shared/middleware';

const router = Router();

// dashboard summary
router.get('/summary', authenticate, getDashboardSummary);

// recent files
router.get('/recent', authenticate, getRecentFiles);

// Global search
router.get('/search', authenticate, searchFiles);

export default router;
