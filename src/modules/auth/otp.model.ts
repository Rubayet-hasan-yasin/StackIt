import mongoose, { Document, Schema } from 'mongoose';

export interface IOTP extends Document {
  email: string;
  otp: string;
  type: 'PASSWORD_RESET' | 'EMAIL_VERIFICATION';
  expiresAt: Date;
  createdAt: Date;
}

const otpSchema = new Schema<IOTP>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['PASSWORD_RESET', 'EMAIL_VERIFICATION'],
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  {
    timestamps: true,
  }
);


otpSchema.index({ email: 1, type: 1 });

export const OTP = mongoose.model<IOTP>('OTP', otpSchema);
