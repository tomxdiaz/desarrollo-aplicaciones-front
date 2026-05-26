import { apiClient } from '../lib/apiClient';
import { Order } from '../types/types';
import { restaurantService } from './restaurant.service';

export const orderService = {
  getMyOrders: async () => {
    const orders = await apiClient<Order[]>('/orders/mine', {
      requireAuth: true,
    });

    return orders;
  },
};
