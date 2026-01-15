import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { IUser } from '../../modules/user/user.model';

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

    // Additional check for deleted users
    const typedUser = user as IUser;
    if (typedUser.isDeleted) {
      return res.status(403).json({
        status: 'ERROR',
        message: 'Account has been deleted',
      });
    }
    
    req.user = user;
    next();
  })(req, res, next);
};
