import { apiClient } from '../lib/apiClient';
import { CreateRestaurantPayload, Restaurant, UpdateRestaurantPayload } from '../types/types';
import { appendImageToFormData } from '../utils/image';

const buildRestaurantFormData = (
  payload: CreateRestaurantPayload | UpdateRestaurantPayload,
): FormData => {
  const form = new FormData();

  form.append('name', payload.name);

  if (payload.description !== undefined && payload.description !== null) {
    form.append('description', payload.description);
  }

  if (payload.address !== undefined && payload.address !== null) {
    form.append('address', payload.address);
  }

  appendImageToFormData(form, payload.imageFile, payload.existingImage);

  return form;
};

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
      body: buildRestaurantFormData(payload),
      requireAuth: true,
    });
  },

  updateRestaurant: async (id: string, payload: UpdateRestaurantPayload) => {
    return apiClient<Restaurant>(`/restaurant/${id}`, {
      method: 'PATCH',
      body: buildRestaurantFormData(payload),
      requireAuth: true,
    });
  },
};
