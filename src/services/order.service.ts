import { apiClient } from '../lib/apiClient';
import {
  CreateOrderPayload,
  Order,
  OrderStatus,
} from '../types/order.types';

export const orderService = {
  getRestaurantOrders: async (restaurantId: string) => {
    return apiClient<Order[]>(`/restaurants/${restaurantId}/orders`, {
      requireAuth: true,
    });
  },

  updateOrderStatus: async (restaurantId: string, orderId: string, status: OrderStatus) => {
    return apiClient<Order>(`/restaurants/${restaurantId}/orders/${orderId}/status`, {
      method: 'PATCH',
      requireAuth: true,
      body: { status },
    });
  },

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
