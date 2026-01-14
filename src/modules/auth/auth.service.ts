import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { User, IUser } from '../user/user.model';
import { OTP } from './otp.model';
import config from '../../config';
import type { RegisterDTO, AuthResponse, ResetPasswordDTO, JWTPayload } from '../../shared/types';

export class AuthService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Setup email transporter
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.port === 465,
      auth: config.email.user && config.email.password ? {
        user: config.email.user,
        pass: config.email.password,
      } : undefined,
    });
  }

  // Generate JWT token
  generateToken(userId: string, email: string): string {
    const payload: JWTPayload = { userId, email };
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    } as jwt.SignOptions);
  }

  // Format user response
  formatUserResponse(user: IUser, token: string): AuthResponse {
    return {
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
      },
    };
  }

  // Register new user
  async register(data: RegisterDTO): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Create user
    const user = await User.create({
      email: data.email,
      password: data.password,
      name: data.name,
    });

    // Generate token
    const token = this.generateToken(user._id.toString(), user.email);

    return this.formatUserResponse(user, token);
  }

  // Login user
  async login(user: IUser): Promise<AuthResponse> {
    const token = this.generateToken(user._id.toString(), user.email);
    return this.formatUserResponse(user, token);
  }

  // Request password reset OTP
  async requestPasswordReset(email: string): Promise<void> {
    const user = await User.findOne({ email });
    
    if (!user) {
      throw new Error('No user found with this email');
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any existing OTP for this email
    await OTP.deleteMany({ email, type: 'PASSWORD_RESET' });

    // Create new OTP document
    await OTP.create({
      email,
      otp,
      type: 'PASSWORD_RESET',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    // Send email
    await this.sendResetPasswordEmail(user.email, user.name, otp);
  }

  // Reset password with OTP
  async resetPassword(data: ResetPasswordDTO): Promise<void> {
    const user = await User.findOne({ email: data.email }).select('+password');

    if (!user) {
      throw new Error('No user found with this email');
    }

    // Find valid OTP
    const otpDoc = await OTP.findOne({
      email: data.email,
      type: 'PASSWORD_RESET',
      expiresAt: { $gt: new Date() },
    });

    if (!otpDoc) {
      throw new Error('No valid OTP found. Please request a new password reset');
    }

    if (otpDoc.otp !== data.otp) {
      throw new Error('Invalid OTP');
    }

    // Update password
    user.password = data.newPassword;
    await user.save();

    // Delete used OTP
    await OTP.deleteOne({ _id: otpDoc._id });
  }

  // Send reset password email
  private async sendResetPasswordEmail(email: string, name: string, otp: string): Promise<void> {
    const mailOptions = {
      from: config.email.from,
      to: email,
      subject: 'Password Reset OTP',
      html: `
        <h1>Password Reset</h1>
        <p>Hi ${name},</p>
        <p>You requested to reset your password. Use the OTP below:</p>
        <h2>${otp}</h2>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Email send error:', error);
      throw new Error('Failed to send reset password email');
    }
  }

  // Get user profile
  async getProfile(userId: string): Promise<IUser> {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  // Update user profile
  async updateProfile(userId: string, name?: string, avatar?: string): Promise<IUser> {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    if (name) user.name = name;
    if (avatar) user.avatar = avatar;

    await user.save();
    return user;
  }
}

export const authService = new AuthService();
