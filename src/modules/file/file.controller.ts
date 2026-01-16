import { Request, Response } from 'express';
import { fileService } from './file.service';
import { HTTP_STATUS, API_STATUS } from '../../shared/constants';
import { IUser } from '../user/user.model';

export const getFiles = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    const { type, folderId, isFavorite } = req.query;

    const filters: any = {};
    
    if (type) {
      filters.type = type as string;
    }
    
    if (folderId !== undefined) {
      filters.folderId = folderId as string;
    }
    
    if (isFavorite !== undefined) {
      filters.isFavorite = isFavorite === 'true';
    }

    const files = await fileService.getFiles(user._id.toString(), filters);

    res.status(HTTP_STATUS.OK).json({
      status: API_STATUS.OK,
      data: files,
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: API_STATUS.ERROR,
      message: error instanceof Error ? error.message : 'Failed to get files',
    });
  }
};

export const getFileById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    const { id } = req.params;

    const file = await fileService.getFileById(id, user._id.toString());

    res.status(HTTP_STATUS.OK).json({
      status: API_STATUS.OK,
      data: file,
    });
  } catch (error) {
    res.status(HTTP_STATUS.NOT_FOUND).json({
      status: API_STATUS.ERROR,
      message: error instanceof Error ? error.message : 'File not found',
    });
  }
};

export const deleteFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    const { id } = req.params;

    await fileService.deleteFile(id, user._id.toString());

    res.status(HTTP_STATUS.OK).json({
      status: API_STATUS.OK,
      message: 'File deleted successfully',
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: API_STATUS.ERROR,
      message: error instanceof Error ? error.message : 'Failed to delete file',
    });
  }
};
