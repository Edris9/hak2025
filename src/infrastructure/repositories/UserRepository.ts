import { IUserRepository, UpdateProfileData, ChangePasswordData } from '@/domain/interfaces';
import { User, UserPreferences, NotificationSettings } from '@/domain/models';
import { UpdateUserResponse, ChangePasswordResponse } from '@/application/dto';
import { axiosClient } from '@/infrastructure/api';

export class UserRepository implements IUserRepository {
  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await axiosClient.put<UpdateUserResponse>('/user/profile', data);
    return response.data.user;
  }

  async changePassword(data: ChangePasswordData): Promise<void> {
    await axiosClient.put<ChangePasswordResponse>('/user/password', data);
  }

  async updatePreferences(data: Partial<UserPreferences>): Promise<User> {
    const response = await axiosClient.put<UpdateUserResponse>('/user/preferences', data);
    return response.data.user;
  }

  async updateNotifications(data: Partial<NotificationSettings>): Promise<User> {
    const response = await axiosClient.put<UpdateUserResponse>('/user/notifications', data);
    return response.data.user;
  }
}

export const userRepository = new UserRepository();
