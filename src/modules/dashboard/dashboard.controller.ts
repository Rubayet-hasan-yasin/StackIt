import { Request, Response } from 'express';
import { dashboardService } from './dashboard.service';
import { HTTP_STATUS, API_STATUS } from '../../shared/constants';
import { IUser } from '../user/user.model';

export const getDashboardSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;

    const summary = await dashboardService.getDashboardSummary(user._id.toString());

    res.status(HTTP_STATUS.OK).json({
      status: API_STATUS.OK,
      data: summary,
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: API_STATUS.ERROR,
      message: error instanceof Error ? error.message : 'Failed to get dashboard summary',
    });
  }
};

export const getRecentFiles = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

    const recentFiles = await dashboardService.getRecentFiles(user._id.toString(), limit);

    res.status(HTTP_STATUS.OK).json({
      status: API_STATUS.OK,
      data: recentFiles,
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: API_STATUS.ERROR,
      message: error instanceof Error ? error.message : 'Failed to get recent files',
    });
  }
};

export const searchFiles = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    const { q } = req.query;

    if (!q) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: API_STATUS.ERROR,
        message: 'Search query parameter "q" is required',
      });
      return;
    }

    const results = await dashboardService.searchFiles(user._id.toString(), q as string);

    res.status(HTTP_STATUS.OK).json({
      status: API_STATUS.OK,
      data: results,
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: API_STATUS.ERROR,
      message: error instanceof Error ? error.message : 'Failed to search files',
    });
  }
};
