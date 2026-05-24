import { apiClient } from '../lib/apiClient';
import { AppRoleEnum, AppUser } from '../types/types';

export const appUserService = {
  getMyAppUser: async () => {
    return apiClient<AppUser>('/app_user/me', {
      requireAuth: true,
    });
  },

  getAllUsers: async () => {
    return apiClient<AppUser[]>('/app_user', {
      requireAuth: true,
    });
  },

  updateUserRole: async ({ appUserId, role }: { appUserId: string; role: AppRoleEnum }) => {
    return apiClient<AppUser>('/app_user/role', {
      method: 'PATCH',
      requireAuth: true,
      body: {
        appUserId,
        role,
      },
    });
  },
};
