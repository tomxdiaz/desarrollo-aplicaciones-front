import { COLORS } from '../constants/colors';
import { RestaurantOrderStatusEnum } from './types';

export const ALL_ORDER_STATUS_FILTER = 'ALL' as const;
export type OrderStatusFilter = typeof ALL_ORDER_STATUS_FILTER | RestaurantOrderStatusEnum;

export const RESTAURANT_ORDER_STATUS_LABELS: Record<RestaurantOrderStatusEnum, string> = {
  [RestaurantOrderStatusEnum.PENDING]: 'Pendiente',
  [RestaurantOrderStatusEnum.IN_PROCESS]: 'En proceso',
  [RestaurantOrderStatusEnum.DELIVERED]: 'Entregado',
  [RestaurantOrderStatusEnum.CANCELLED]: 'Cancelado',
};

export const RESTAURANT_ORDER_STATUS_COLORS: Record<RestaurantOrderStatusEnum, { color: string }> = {
  [RestaurantOrderStatusEnum.PENDING]: { color: COLORS.status.advertencia },
  [RestaurantOrderStatusEnum.IN_PROCESS]: { color: COLORS.primary.caramelo },
  [RestaurantOrderStatusEnum.DELIVERED]: { color: COLORS.status.exito },
  [RestaurantOrderStatusEnum.CANCELLED]: { color: COLORS.status.error },
};

export const getRestaurantOrderStatusStyle = (status: RestaurantOrderStatusEnum) =>
  RESTAURANT_ORDER_STATUS_COLORS[status] ?? { color: COLORS.common.gris_oscuro };

export const ORDER_STATUS_FILTER_OPTIONS: { key: OrderStatusFilter; label: string }[] = [
  { key: ALL_ORDER_STATUS_FILTER, label: 'Todos' },
  ...Object.values(RestaurantOrderStatusEnum).map((status) => ({
    key: status,
    label: RESTAURANT_ORDER_STATUS_LABELS[status],
  })),
];
