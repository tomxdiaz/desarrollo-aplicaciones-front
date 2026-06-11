import { COLORS } from '../constants/colors';
import { OrderStatus } from './order.types';

export const ALL_ORDER_STATUS_FILTER = 'ALL' as const;
export type OrderStatusFilter = typeof ALL_ORDER_STATUS_FILTER | OrderStatus;

export const RESTAURANT_ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pendiente',
  IN_PROCESS: 'En proceso',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
};

export const RESTAURANT_ORDER_STATUS_COLORS: Record<OrderStatus, { color: string }> = {
  PENDING: { color: COLORS.status.advertencia },
  IN_PROCESS: { color: COLORS.primary.caramelo },
  DELIVERED: { color: COLORS.status.exito },
  CANCELLED: { color: COLORS.status.error },
};

export const getRestaurantOrderStatusStyle = (status: OrderStatus) =>
  RESTAURANT_ORDER_STATUS_COLORS[status] ?? { color: COLORS.common.gris_oscuro };

const ORDER_STATUS_KEYS: OrderStatus[] = ['PENDING', 'IN_PROCESS', 'DELIVERED', 'CANCELLED'];

export const ORDER_STATUS_FILTER_OPTIONS: { key: OrderStatusFilter; label: string }[] = [
  { key: ALL_ORDER_STATUS_FILTER, label: 'Todos' },
  ...ORDER_STATUS_KEYS.map((status) => ({
    key: status,
    label: RESTAURANT_ORDER_STATUS_LABELS[status],
  })),
];
