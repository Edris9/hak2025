import { IAuthRepository } from '@/domain/interfaces';
import { User } from '@/domain/models';
import {
  AuthResponse,
  LoginCredentials,
  RefreshResponse,
  RegisterData,
} from '@/application/dto';
import { axiosClient, setAccessToken } from '@/infrastructure/api';

export class AuthRepository implements IAuthRepository {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axiosClient.post<AuthResponse>('/auth/login', credentials);
    setAccessToken(response.data.accessToken);
    return response.data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await axiosClient.post<AuthResponse>('/auth/register', data);
    setAccessToken(response.data.accessToken);
    return response.data;
  }

  async refresh(): Promise<RefreshResponse> {
    const response = await axiosClient.post<RefreshResponse>('/auth/refresh');
    setAccessToken(response.data.accessToken);
    return response.data;
  }

  async logout(): Promise<void> {
    await axiosClient.post('/auth/logout');
    setAccessToken(null);
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await axiosClient.get<User>('/auth/me');
      return response.data;
    } catch {
      return null;
    }
  }
}

export const authRepository = new AuthRepository();
