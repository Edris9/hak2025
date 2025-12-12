import { User, UserPreferences, NotificationSettings } from '@/domain/models';

export interface UpdateProfileData {
  firstName: string;
  lastName: string;
  email: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export type UpdatePreferencesData = Partial<UserPreferences>;

export type UpdateNotificationsData = Partial<NotificationSettings>;

export interface UpdateUserResponse {
  user: User;
  message: string;
}

export interface ChangePasswordResponse {
  message: string;
}
