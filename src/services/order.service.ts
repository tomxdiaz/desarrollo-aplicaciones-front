import { apiClient } from '../lib/apiClient';
import { Order } from '../types/types';

export const orderService = {
  getMyOrders: async () => {
    const orders = await apiClient<Order[]>('/orders/mine', {
      requireAuth: true,
    });

    return orders;
  },

  getMyOrderById: async (restaurantId: string, id: string) => {
    return apiClient<Order>(`/restaurants/${restaurantId}/orders/${id}`, {
      requireAuth: true,
    });
  },
};
