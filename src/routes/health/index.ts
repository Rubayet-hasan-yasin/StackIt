import { Router } from 'express';
import { healthCheck, healthCheckDetailed } from './health.controller';

const router = Router();

/**
 * @route   GET /health
 * @desc    Simple health check
 * @access  Public
 */
router.get('/', healthCheck);

/**
 * @route   GET /health/detailed
 * @desc    Detailed health check with system information
 * @access  Public
 */
router.get('/detailed', healthCheckDetailed);

export default router;
