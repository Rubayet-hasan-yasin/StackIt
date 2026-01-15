import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { HTTP_STATUS, API_STATUS } from '../../shared/constants';
import type { RegisterDTO, ResetPasswordDTO } from '../../shared/types';
import { IUser } from '../user/user.model';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface User extends IUser {}
  }
}

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: RegisterDTO = req.body;
    const result = await authService.register(data);

    res.status(HTTP_STATUS.CREATED).json({
      status: API_STATUS.OK,
      message: 'Registration successful',
      data: result,
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: API_STATUS.ERROR,
      message: error instanceof Error ? error.message : 'Registration failed',
    });
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user as IUser;
    
    if (!user) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: API_STATUS.ERROR,
        message: 'Authentication failed',
      });
      return;
    }

    const result = await authService.login(user);

    res.status(HTTP_STATUS.OK).json({
      status: API_STATUS.OK,
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const googleCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    
    if (!user) {
      res.redirect('/login?error=authentication_failed');
      return;
    }

    const result = await authService.login(user);

    // Redirect to client with token
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${result.token}`);
  } catch (error) {
    res.redirect('/login?error=server_error');
  }
};

export const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    await authService.requestPasswordReset(email);

    res.status(HTTP_STATUS.OK).json({
      status: API_STATUS.OK,
      message: 'Password reset OTP sent to your email',
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: API_STATUS.ERROR,
      message: error instanceof Error ? error.message : 'Failed to send reset email',
    });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: ResetPasswordDTO = req.body;
    await authService.resetPassword(data);

    res.status(HTTP_STATUS.OK).json({
      status: API_STATUS.OK,
      message: 'Password reset successful',
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: API_STATUS.ERROR,
      message: error instanceof Error ? error.message : 'Password reset failed',
    });
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.status(HTTP_STATUS.OK).json({
    status: API_STATUS.OK,
    message: 'Logout successful',
  });
};

export const googleMobileLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idToken } = req.body;
    
    const result = await authService.googleMobileLogin(idToken);

    res.status(HTTP_STATUS.OK).json({
      status: API_STATUS.OK,
      message: 'Google login successful',
      data: result,
    });
  } catch (error) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      status: API_STATUS.ERROR,
      message: error instanceof Error ? error.message : 'Google authentication failed',
    });
  }
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    const { currentPassword, newPassword } = req.body;
    
    if (!user) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: API_STATUS.ERROR,
        message: 'Unauthorized',
      });
      return;
    }

    await authService.changePassword(user._id.toString(), currentPassword, newPassword);

    res.status(HTTP_STATUS.OK).json({
      status: API_STATUS.OK,
      message: 'Password changed successfully',
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: API_STATUS.ERROR,
      message: error instanceof Error ? error.message : 'Failed to change password',
    });
  }
};

export const deleteAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;
    
    if (!user) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: API_STATUS.ERROR,
        message: 'Unauthorized',
      });
      return;
    }

    await authService.deleteUser(user._id.toString());

    res.status(HTTP_STATUS.OK).json({
      status: API_STATUS.OK,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: API_STATUS.ERROR,
      message: error instanceof Error ? error.message : 'Failed to delete account',
    });
  }
};
