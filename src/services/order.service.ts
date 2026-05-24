import { apiClient } from '../lib/apiClient';
import { restaurantService } from './restaurant.service';
import { MyOrderListItem, Order } from '../types/order.types';

export const orderService = {
  getMyOrders: async () => {
    const orders = await apiClient<Order[]>('/restaurants/0/orders/mine', {
      requireAuth: true,
    });

    // Enrich orders with restaurant name when possible
    const restaurantIds = Array.from(new Set(orders.map((o) => o.restaurant_id).filter(Boolean)));

    const restaurantNameMap: Record<number, string> = {};

    await Promise.all(
      restaurantIds.map(async (rid) => {
        try {
          const r = await restaurantService.getRestaurantById(String(rid));
          restaurantNameMap[rid] = r.name;
        } catch (e) {
          // ignore failures, leave name undefined
        }
      }),
    );

    return orders.map((o) => ({
      ...o,
      restaurant_name: restaurantNameMap[o.restaurant_id] ?? `#${o.restaurant_id}`,
    })) as MyOrderListItem[];
  },

  getMyOrderById: async (restaurantId: string, id: string) => {
    return apiClient<Order>(`/restaurants/${restaurantId}/orders/${id}`, {
      requireAuth: true,
    });
  },
};
