import { Request, Response, NextFunction } from 'express';
import config from '../../config';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  console.error('Error:', err);
  res.status(500).json({
    status: 'ERROR',
    message: config.nodeEnv === 'development' ? err.message : 'Internal server error',
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
}
