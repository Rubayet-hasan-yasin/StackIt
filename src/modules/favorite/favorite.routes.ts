import { Router } from 'express';
import { getFavorites, addFavorite, removeFavorite } from './favorite.controller';
import { authenticate } from '../../shared/middleware';

const router = Router();

// Get all favorites
router.get('/', authenticate, getFavorites);

// Mark item as favorite
router.post('/:itemId', authenticate, addFavorite);

// Remove item from favorites
router.delete('/:itemId', authenticate, removeFavorite);

export default router;
