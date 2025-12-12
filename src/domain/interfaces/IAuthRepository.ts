import { User } from '../models';
import { AuthResponse, LoginCredentials, RegisterData, RefreshResponse } from '@/application/dto/auth.dto';

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  register(data: RegisterData): Promise<AuthResponse>;
  refresh(): Promise<RefreshResponse>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}
