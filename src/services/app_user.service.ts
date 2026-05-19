import { apiClient } from '../lib/apiClient';
import { AppUser } from '../types/types';

export const appUserService = {
  getMyAppUser: async () => {
    return apiClient<AppUser>('/app_user/me', {
      requireAuth: true,
    });
  },
};
