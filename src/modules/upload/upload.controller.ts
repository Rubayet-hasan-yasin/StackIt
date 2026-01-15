import { Request, Response } from 'express';
import { uploadService } from './upload.service';
import { HTTP_STATUS, API_STATUS } from '../../shared/constants';

export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: API_STATUS.ERROR,
        message: 'No file uploaded',
      });
      return;
    }

    const result = await uploadService.uploadImage(req.file);

    res.status(HTTP_STATUS.OK).json({
      status: API_STATUS.OK,
      message: 'Image uploaded successfully',
      data: result,
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: API_STATUS.ERROR,
      message: error instanceof Error ? error.message : 'Failed to upload image',
    });
  }
};

export const uploadAvatar = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: API_STATUS.ERROR,
        message: 'No file uploaded',
      });
      return;
    }

    const result = await uploadService.uploadAvatar(req.file);

    res.status(HTTP_STATUS.OK).json({
      status: API_STATUS.OK,
      message: 'Avatar uploaded successfully',
      data: result,
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: API_STATUS.ERROR,
      message: error instanceof Error ? error.message : 'Failed to upload avatar',
    });
  }
};
