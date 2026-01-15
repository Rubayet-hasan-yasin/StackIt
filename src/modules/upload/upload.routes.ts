import { Router } from 'express';
import { uploadImage, uploadAvatar } from './upload.controller';
import { uploadSingle } from './upload.middleware';
import { authenticate } from '../../shared/middleware';

const router = Router();

// Upload general image
router.post('/image', authenticate, uploadSingle('image'), uploadImage);

// Upload avatar (optimized for profile pictures)
router.post('/avatar', authenticate, uploadSingle('avatar'), uploadAvatar);

export default router;
