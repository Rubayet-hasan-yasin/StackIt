import { Request, Response } from 'express';
import { favoriteService } from './favorite.service';
import { HTTP_STATUS, API_STATUS } from '../../shared/constants';
import { IUser } from '../user/user.model';

export const getFavorites = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;

    const favorites = await favoriteService.getFavorites(user._id.toString());

    res.status(HTTP_STATUS.OK).json({
      status: API_STATUS.OK,
      data: favorites,
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: API_STATUS.ERROR,
      message: error instanceof Error ? error.message : 'Failed to get favorites',
    });
  }
};

export const addFavorite = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    const { itemId } = req.params;

    const item = await favoriteService.addFavorite(itemId, user._id.toString());

    res.status(HTTP_STATUS.OK).json({
      status: API_STATUS.OK,
      message: 'Added to favorites',
      data: item,
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: API_STATUS.ERROR,
      message: error instanceof Error ? error.message : 'Failed to add favorite',
    });
  }
};

export const removeFavorite = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    const { itemId } = req.params;

    const item = await favoriteService.removeFavorite(itemId, user._id.toString());

    res.status(HTTP_STATUS.OK).json({
      status: API_STATUS.OK,
      message: 'Removed from favorites',
      data: item,
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: API_STATUS.ERROR,
      message: error instanceof Error ? error.message : 'Failed to remove favorite',
    });
  }
};
