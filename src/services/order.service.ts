import { apiClient } from '../lib/apiClient';
import { CreateOrderPayload } from '../types/order.types';
import { Order } from '../types/types';

export const orderService = {
  createOrder: async (restaurantId: string, payload: CreateOrderPayload) => {
    const order = await apiClient<Order>(`/restaurants/${restaurantId}/orders`, {
      method: 'POST',
      requireAuth: true,
      body: payload,
    });

    return order;
  },

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
