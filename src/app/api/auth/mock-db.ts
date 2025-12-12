import { UserWithPassword, defaultPreferences, defaultNotifications } from '@/domain/models';

// Use global to persist mock database across Next.js hot reloads in development
// This prevents users from being logged out when the server restarts
declare global {
  // eslint-disable-next-line no-var
  var mockDbState: {
    users: Map<string, UserWithPassword>;
    refreshTokens: Map<string, string>;
    accessTokens: Map<string, string>;
    initialized: boolean;
  } | undefined;
}

// Initialize or reuse existing global state
if (!global.mockDbState) {
  global.mockDbState = {
    users: new Map(),
    refreshTokens: new Map(),
    accessTokens: new Map(),
    initialized: false,
  };
}

const { users, refreshTokens, accessTokens } = global.mockDbState;

// Seed test user for development (only once)
const testUser: UserWithPassword = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  email: 'test@example.com',
  password: 'Password123',
  firstName: 'Test',
  lastName: 'User',
  preferences: { ...defaultPreferences },
  notifications: { ...defaultNotifications },
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

if (!global.mockDbState.initialized) {
  users.set(testUser.id, testUser);
  global.mockDbState.initialized = true;
}

// Token configuration
export const ACCESS_TOKEN_EXPIRY = 900; // 15 minutes in seconds
export const REFRESH_TOKEN_EXPIRY = 604800; // 7 days in seconds

export const mockDb = {
  users: {
    findByEmail: (email: string): UserWithPassword | undefined => {
      for (const user of users.values()) {
        if (user.email === email) {
          return user;
        }
      }
      return undefined;
    },

    findById: (id: string): UserWithPassword | undefined => {
      return users.get(id);
    },

    create: (user: UserWithPassword): UserWithPassword => {
      users.set(user.id, user);
      return user;
    },

    update: (id: string, data: Partial<UserWithPassword>): UserWithPassword | undefined => {
      const user = users.get(id);
      if (!user) return undefined;
      const updatedUser = { ...user, ...data, updatedAt: new Date() };
      users.set(id, updatedUser);
      return updatedUser;
    },
  },

  refreshTokens: {
    set: (token: string, userId: string) => {
      refreshTokens.set(token, userId);
    },

    get: (token: string): string | undefined => {
      return refreshTokens.get(token);
    },

    delete: (token: string) => {
      refreshTokens.delete(token);
    },

    deleteByUserId: (userId: string) => {
      for (const [token, uid] of refreshTokens.entries()) {
        if (uid === userId) {
          refreshTokens.delete(token);
        }
      }
    },
  },

  accessTokens: {
    set: (token: string, userId: string) => {
      accessTokens.set(token, userId);
    },

    get: (token: string): string | undefined => {
      return accessTokens.get(token);
    },

    delete: (token: string) => {
      accessTokens.delete(token);
    },

    deleteByUserId: (userId: string) => {
      for (const [token, uid] of accessTokens.entries()) {
        if (uid === userId) {
          accessTokens.delete(token);
        }
      }
    },
  },
};

// Utility functions
export const generateId = (): string => {
  return crypto.randomUUID();
};

export const generateToken = (): string => {
  return `${crypto.randomUUID()}-${crypto.randomUUID()}`;
};

// Simple password validation (in real app, use bcrypt)
export const validatePassword = (input: string, stored: string): boolean => {
  return input === stored;
};
