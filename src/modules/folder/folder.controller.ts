import { Request, Response } from 'express';
import { folderService } from './folder.service';
import { HTTP_STATUS, API_STATUS } from '../../shared/constants';
import { IUser } from '../user/user.model';

export const getFolders = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    const { parentId } = req.query;

    const folders = await folderService.getFolders(
      user._id.toString(),
      parentId as string
    );

    res.status(HTTP_STATUS.OK).json({
      status: API_STATUS.OK,
      data: folders,
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: API_STATUS.ERROR,
      message: error instanceof Error ? error.message : 'Failed to get folders',
    });
  }
};

export const getFolderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    const { id } = req.params;

    const folder = await folderService.getFolderById(id, user._id.toString());

    res.status(HTTP_STATUS.OK).json({
      status: API_STATUS.OK,
      data: folder,
    });
  } catch (error) {
    res.status(HTTP_STATUS.NOT_FOUND).json({
      status: API_STATUS.ERROR,
      message: error instanceof Error ? error.message : 'Folder not found',
    });
  }
};

export const createFolder = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    const { name, parentId } = req.body;

    if (!name) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: API_STATUS.ERROR,
        message: 'Folder name is required',
      });
      return;
    }

    const folder = await folderService.createFolder(
      user._id.toString(),
      name,
      parentId
    );

    res.status(HTTP_STATUS.CREATED).json({
      status: API_STATUS.OK,
      message: 'Folder created successfully',
      data: folder,
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: API_STATUS.ERROR,
      message: error instanceof Error ? error.message : 'Failed to create folder',
    });
  }
};

export const updateFolder = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: API_STATUS.ERROR,
        message: 'Folder name is required',
      });
      return;
    }

    const folder = await folderService.updateFolder(id, user._id.toString(), name);

    res.status(HTTP_STATUS.OK).json({
      status: API_STATUS.OK,
      message: 'Folder updated successfully',
      data: folder,
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: API_STATUS.ERROR,
      message: error instanceof Error ? error.message : 'Failed to update folder',
    });
  }
};

export const deleteFolder = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    const { id } = req.params;

    await folderService.deleteFolder(id, user._id.toString());

    res.status(HTTP_STATUS.OK).json({
      status: API_STATUS.OK,
      message: 'Folder deleted successfully',
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: API_STATUS.ERROR,
      message: error instanceof Error ? error.message : 'Failed to delete folder',
    });
  }
};

export const getFilesInFolder = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    const { id } = req.params;

    const files = await folderService.getFilesInFolder(id, user._id.toString());

    res.status(HTTP_STATUS.OK).json({
      status: API_STATUS.OK,
      data: files,
    });
  } catch (error) {
    res.status(HTTP_STATUS.NOT_FOUND).json({
      status: API_STATUS.ERROR,
      message: error instanceof Error ? error.message : 'Folder not found',
    });
  }
};
