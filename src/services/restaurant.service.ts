import { apiClient } from '../lib/apiClient';
import { CreateRestaurantPayload, Restaurant } from '../types/types';

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

  createRestaurant: async (payload: CreateRestaurantPayload) => {
    return apiClient<Restaurant>('/restaurant', {
      method: 'POST',
      body: payload,
      requireAuth: true,
    });
  },
};
