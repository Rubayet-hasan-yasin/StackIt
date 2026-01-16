import { Router } from 'express';
import { getImages, uploadImage, deleteImage } from './image.controller';
import { authenticate } from '../../shared/middleware';
import { validate } from '../../shared/middleware/validate';
import { uploadSingle } from '../upload';
import { uploadImageSchema } from './image.validation';

const router = Router();

// Get all images
router.get('/', authenticate, getImages);

// Upload an image
router.post('/upload', authenticate, uploadSingle('image'), validate(uploadImageSchema), uploadImage);

// Delete an image
router.delete('/:id', authenticate, deleteImage);

export default router;
