import { Request, Response } from 'express';
import { HTTP_STATUS, API_STATUS } from '../../shared/constants';
import { healthService } from './health.service';

export const healthCheck = async (_req: Request, res: Response): Promise<void> => {
  try {
    const health = await healthService.getSimpleHealth();
    res.status(HTTP_STATUS.OK).json(health);
  } catch (error) {
    res.status(HTTP_STATUS.SERVICE_UNAVAILABLE).json({
      status: API_STATUS.ERROR,
      message: 'Service is unhealthy',
      timestamp: new Date().toISOString(),
    });
  }
};

export const healthCheckDetailed = async (_req: Request, res: Response): Promise<void> => {
  try {
    const health = await healthService.getDetailedHealth();
    const statusCode = health.status === API_STATUS.OK ? HTTP_STATUS.OK : HTTP_STATUS.SERVICE_UNAVAILABLE;
    res.status(statusCode).json(health);
  } catch (error) {
    res.status(HTTP_STATUS.SERVICE_UNAVAILABLE).json({
      status: API_STATUS.ERROR,
      message: 'Unable to retrieve health information',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
};
