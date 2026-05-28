import { apiClient } from '../lib/apiClient';
import { RestaurantStaff } from '../types/types';

export const restaurantStaffService = {
  getMyRestaurantStaffInfo: async (restaurantId: string) => {
    return apiClient<RestaurantStaff>(`/restaurant/${restaurantId}/staff/me`, {
      requireAuth: true,
    });
  },
};
