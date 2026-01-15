import { Request, Response } from 'express';
import { userService } from './user.service';
import { HTTP_STATUS, API_STATUS } from '../../shared/constants';
import type { UpdateProfileDTO } from '../../shared/types';
import { IUser } from './user.model';
import config from '../../config';

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    
    if (!user) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: API_STATUS.ERROR,
        message: 'Unauthorized',
      });
      return;
    }

    const profile = await userService.getProfile(user._id.toString());

    res.status(HTTP_STATUS.OK).json({
      status: API_STATUS.OK,
      data: {
        id: profile._id,
        email: profile.email,
        name: profile.name,
        avatar: `${config.BACKEND_URL}${profile.avatar}`,
        isEmailVerified: profile.isEmailVerified,
        storageLimit: profile.storageLimit,
        usedStorage: profile.usedStorage,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: API_STATUS.ERROR,
      message: error instanceof Error ? error.message : 'Failed to get profile',
    });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    const data: UpdateProfileDTO = req.body;
    
    if (!user) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: API_STATUS.ERROR,
        message: 'Unauthorized',
      });
      return;
    }

    const updatedUser = await userService.updateProfile(
      user._id.toString(),
      data.name,
      data.avatar
    );

    res.status(HTTP_STATUS.OK).json({
      status: API_STATUS.OK,
      message: 'Profile updated successfully',
      data: {
        id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
        avatar: updatedUser.avatar,
      },
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: API_STATUS.ERROR,
      message: error instanceof Error ? error.message : 'Failed to update profile',
    });
  }
};

export const updateAvatar = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;

    const name = req.body.name || undefined;
    const avatarFile = req.file;
    
    
    if (!user) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: API_STATUS.ERROR,
        message: 'Unauthorized',
      });
      return;
    }

    const updatedUser = await userService.updateProfileWithAvatar(
      user._id.toString(),
      name,
      avatarFile
    );

    res.status(HTTP_STATUS.OK).json({
      status: API_STATUS.OK,
      message: 'Profile updated successfully',
      data: {
        id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
        avatar: updatedUser.avatar,
      },
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: API_STATUS.ERROR,
      message: error instanceof Error ? error.message : 'Failed to update avatar',
    });
  }
};
