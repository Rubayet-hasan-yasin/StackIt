import { Router } from 'express';
import { getProfile, updateAvatar } from './user.controller';
import { authenticate } from '../../shared/middleware';
import { validate } from '../../shared/middleware/validate';
import { uploadSingle } from '../upload';
import { updateProfileSchema } from './user.validation';

const router = Router();

// Get user profile
router.get('/profile', authenticate, getProfile);

router.put('/profile', authenticate, uploadSingle('avatar'), validate(updateProfileSchema), updateAvatar);

export default router;
