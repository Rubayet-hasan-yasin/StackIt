export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    isEmailVerified: boolean;
  };
}

export interface ResetPasswordDTO {
  email: string;
  otp: string;
  newPassword: string;
}

export interface UpdateProfileDTO {
  name?: string;
  avatar?: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
}
