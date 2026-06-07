import { apiClient } from '../lib/apiClient';
import { CreateStaffPayload, RestaurantStaff, RestaurantStaffEnum } from '../types/types';

export const restaurantStaffService = {
  getMyRestaurantStaffInfo: async (restaurantId: string) => {
    return apiClient<RestaurantStaff>(`/restaurant/${restaurantId}/staff/me`, {
      requireAuth: true,
    });
  },

  getRestaurantStaff: async (restaurantId: string) => {
    return apiClient<RestaurantStaff[]>(`/restaurant/${restaurantId}/staff`, {
      requireAuth: true,
    });
  },

  addStaff: async (restaurantId: string, payload: CreateStaffPayload) => {
    return apiClient<{ success: true }>(`/restaurant/${restaurantId}/staff`, {
      method: 'POST',
      requireAuth: true,
      body: payload,
    });
  },

  updateStaffRole: async (restaurantId: string, userId: string, role: RestaurantStaffEnum) => {
    return apiClient<RestaurantStaff>(`/restaurant/${restaurantId}/staff/${userId}/role`, {
      method: 'PATCH',
      requireAuth: true,
      body: { role },
    });
  },

  removeStaff: async (restaurantId: string, userId: string) => {
    return apiClient<{ success: true }>(`/restaurant/${restaurantId}/staff/${userId}`, {
      method: 'DELETE',
      requireAuth: true,
    });
  },
};
