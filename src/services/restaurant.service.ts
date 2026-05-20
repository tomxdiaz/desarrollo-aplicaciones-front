import { apiClient } from '../lib/apiClient';
import { Restaurant } from '../types/types';

export const restaurantService = {
  getAllRestaurants: async () => {
    return apiClient<Restaurant[]>('/restaurant', {
      requireAuth: false,
    });
  },

  getRestaurantById: async (id: string) => {
    return apiClient<Restaurant>(`/restaurant/${id}`, {
      requireAuth: false,
    });
  },

  getMyRestaurants: async () => {
    return apiClient<Restaurant[]>('/restaurant/me', {
      requireAuth: true,
    });
  },
};
