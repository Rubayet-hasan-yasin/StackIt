import { Router } from 'express';
import { healthCheck, healthCheckDetailed } from './health.controller';

const router = Router();

router.get('/', healthCheck);

router.get('/detailed', healthCheckDetailed);

export default router;
