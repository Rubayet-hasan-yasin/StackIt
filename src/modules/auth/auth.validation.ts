import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  name: z.string().min(2, 'Name must be at least 2 characters long').max(50, 'Name cannot exceed 50 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const requestPasswordResetSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
});

export const verifyOTPSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^[0-9]+$/, 'OTP must contain only numbers'),
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^[0-9]+$/, 'OTP must contain only numbers'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').max(50, 'Name cannot exceed 50 characters').optional(),
  avatar: z.string().url('Avatar must be a valid URL').optional(),
});

export const setPinSchema = z.object({
  pin: z.string().length(4, 'PIN must be exactly 4 digits').regex(/^[0-9]+$/, 'PIN must contain only numbers'),
});

export type RegisterDTO = z.infer<typeof registerSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
export type RequestPasswordResetDTO = z.infer<typeof requestPasswordResetSchema>;
export type VerifyOTPDTO = z.infer<typeof verifyOTPSchema>;
export type ResetPasswordDTO = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileDTO = z.infer<typeof updateProfileSchema>;
export type SetPinDTO = z.infer<typeof setPinSchema>;
