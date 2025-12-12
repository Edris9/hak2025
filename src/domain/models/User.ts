export interface UserPreferences {
  language: 'en' | 'sv' | 'de' | 'fr' | 'es';
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12h' | '24h';
  theme: 'light' | 'dark' | 'system';
}

export interface NotificationSettings {
  emailNotifications: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  preferences: UserPreferences;
  notifications: NotificationSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithPassword extends User {
  password: string;
}

export const defaultPreferences: UserPreferences = {
  language: 'en',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  theme: 'system',
};

export const defaultNotifications: NotificationSettings = {
  emailNotifications: true,
  marketingEmails: false,
  securityAlerts: true,
};
