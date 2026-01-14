import { Request, Response } from 'express';

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    status: 'ERROR',
    message: 'Route not found',
    path: req.path,
  });
}
