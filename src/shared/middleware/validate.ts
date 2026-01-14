import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
import { HTTP_STATUS, API_STATUS } from '../../shared/constants';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validated = schema.parse(req.body);
      
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        res.status(HTTP_STATUS.BAD_REQUEST).json({
          status: API_STATUS.ERROR,
          message: 'Validation failed',
          errors,
        });
        return;
      }

      // Handle unexpected errors
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: API_STATUS.ERROR,
        message: 'Validation error',
      });
    }
  };
};
