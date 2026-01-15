import { Router } from 'express';
import passport from 'passport';
import {
  register,
  login,
  googleCallback,
  googleMobileLogin,
  requestPasswordReset,
  resetPassword,
  getProfile,
  updateProfile,
  logout,
} from './auth.controller';
import { authenticate } from '../../shared/middleware';
import { validate } from '../../shared/middleware/validate';
import {
  registerSchema,
  loginSchema,
  googleMobileLoginSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
  updateProfileSchema,
} from './auth.validation';

const router = Router();

router.post('/register', validate(registerSchema), register);

router.post(
  '/login',
  validate(loginSchema),
  passport.authenticate('local', { session: false }),
  login
);


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));


router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  googleCallback
);


router.post('/google/mobile', validate(googleMobileLoginSchema), googleMobileLogin);


router.post('/forgot-password', validate(requestPasswordResetSchema), requestPasswordReset);


router.post('/reset-password', validate(resetPasswordSchema), resetPassword);


router.post('/logout', authenticate, logout);


router.get('/profile', authenticate, getProfile);


router.put('/profile', authenticate, validate(updateProfileSchema), updateProfile);

export default router;
