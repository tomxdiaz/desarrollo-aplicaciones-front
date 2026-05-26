import { apiClient } from '../lib/apiClient';
import { Order } from '../types/types';

export const orderService = {
  getMyOrders: async () => {
    const orders = await apiClient<Order[]>('/orders/mine', {
      requireAuth: true,
    });

    return orders;
  },

  getMyOrderById: async (id: string) => {
    return apiClient<Order>(`/orders/${id}`, {
      requireAuth: true,
    });
  },

  cancelMyOrder: async (id: string) => {
    return apiClient<Order>(`/orders/${id}/cancel`, {
      method: 'PATCH',
      requireAuth: true,
    });
  },
};
