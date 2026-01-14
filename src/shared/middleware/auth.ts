import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: Error, user: Express.User) => {
    if (err) {
      return next(err);
    }
    
    if (!user) {
      return res.status(401).json({
        status: 'ERROR',
        message: 'Unauthorized - Invalid or expired token',
      });
    }
    
    req.user = user;
    next();
  })(req, res, next);
};
