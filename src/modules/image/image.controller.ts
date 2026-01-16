import { Request, Response } from 'express';
import { imageService } from './image.service';
import { HTTP_STATUS, API_STATUS } from '../../shared/constants';
import { IUser } from '../user/user.model';

export const getImages = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    const { folderId } = req.query;

    const images = await imageService.getImages(user._id.toString(), folderId as string);

    res.status(HTTP_STATUS.OK).json({
      status: API_STATUS.OK,
      data: images,
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: API_STATUS.ERROR,
      message: error instanceof Error ? error.message : 'Failed to get images',
    });
  }
};

export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    const file = req.file;
    const { name, folderId } = req.body;

    if (!file) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: API_STATUS.ERROR,
        message: 'Image file is required',
      });
      return;
    }

    if (!name) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: API_STATUS.ERROR,
        message: 'Image name is required',
      });
      return;
    }

    const image = await imageService.uploadImage(
      user._id.toString(),
      name,
      file,
      folderId
    );

    res.status(HTTP_STATUS.CREATED).json({
      status: API_STATUS.OK,
      message: 'Image uploaded successfully',
      data: image,
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: API_STATUS.ERROR,
      message: error instanceof Error ? error.message : 'Failed to upload image',
    });
  }
};

export const deleteImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    const { id } = req.params;

    await imageService.deleteImage(id, user._id.toString());

    res.status(HTTP_STATUS.OK).json({
      status: API_STATUS.OK,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: API_STATUS.ERROR,
      message: error instanceof Error ? error.message : 'Failed to delete image',
    });
  }
};
