import { User, UserPreferences, NotificationSettings } from '../models';

export interface UpdateProfileData {
  firstName: string;
  lastName: string;
  email: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface IUserRepository {
  updateProfile(data: UpdateProfileData): Promise<User>;
  changePassword(data: ChangePasswordData): Promise<void>;
  updatePreferences(data: Partial<UserPreferences>): Promise<User>;
  updateNotifications(data: Partial<NotificationSettings>): Promise<User>;
}
