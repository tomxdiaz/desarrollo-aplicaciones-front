import { apiClient } from '../lib/apiClient';
import { AppRoleEnum, AppUser } from '../types/types';

export const appUserService = {
  getMyAppUser: async () => {
    try {
      const result = await apiClient<AppUser>('/app_user/me', {
        requireAuth: true,
      });
      return result;
    } catch (error) {
      console.error('[appUserService] getMyAppUser: FAILED →', error);
      throw error;
    }
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
