import { apiClient } from '../lib/apiClient';
import { CreateTablePayload, RestaurantTable, RestaurantTableStatusEnum } from '../types/types';

export const tableService = {
  createTable: async (restaurantId: string, payload: CreateTablePayload) => {
    return apiClient<RestaurantTable>(`/restaurant/${restaurantId}/tables`, {
      method: 'POST',
      requireAuth: true,
      body: payload,
    });
  },

  deleteTable: async (restaurantId: string, tableId: string) => {
    return apiClient<RestaurantTable>(`/restaurant/${restaurantId}/tables/${tableId}`, {
      method: 'DELETE',
      requireAuth: true,
    });
  },

  // close table = status FREE
  updateTableStatus: async (restaurantId: string, tableId: string, status: RestaurantTableStatusEnum) => {
    return apiClient<RestaurantTable>(`/restaurant/${restaurantId}/tables/${tableId}/status`, {
      method: 'PATCH',
      requireAuth: true,
      body: { status },
    });
  },
};
