import { apiClient } from '../lib/apiClient';
import { restaurantService } from './restaurant.service';

export const orderService = {
  getMyOrders: async () => {
    // The backend controller exposing "mine" is under the route
    // GET /restaurants/:restaurantId/orders/mine (controller: UserOrderController).
    // The controller method does not require the path param, but the route contains it,
    // so we call with restaurantId = 0 as a stable path segment. If your backend
    // exposes a different route, change this path accordingly.
    const orders = await apiClient<any[]>('/restaurants/0/orders/mine', {
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

    return orders.map((o) => ({ ...o, restaurant_name: restaurantNameMap[o.restaurant_id] ?? `#${o.restaurant_id}` }));
  },
};
