import { Router } from 'express';
import healthRoutes from '../modules/health/health.routes';
import authRoutes from '../modules/auth/auth.routes';
import userRoutes from '../modules/user/user.routes';
import uploadRoutes from '../modules/upload/upload.routes';
import { fileRoutes } from '../modules/file';
import { folderRoutes } from '../modules/folder';
import { noteRoutes } from '../modules/note';
import { imageRoutes } from '../modules/image';
import { pdfRoutes } from '../modules/pdf';
import { favoriteRoutes } from '../modules/favorite';
import { dashboardRoutes } from '../modules/dashboard';

const router = Router();

// Mount module routes
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/upload', uploadRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/files', fileRoutes);
router.use('/folders', folderRoutes);
router.use('/notes', noteRoutes);
router.use('/images', imageRoutes);
router.use('/pdfs', pdfRoutes);
router.use('/favorites', favoriteRoutes);

export default router;
