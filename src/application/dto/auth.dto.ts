import { User } from '@/domain/models';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  expiresIn: number;
}

export interface RefreshResponse {
  accessToken: string;
  expiresIn: number;
}

export interface ApiError {
  code: string;
  message: string;
  field?: string;
}

export interface ApiErrorResponse {
  error: ApiError;
}
