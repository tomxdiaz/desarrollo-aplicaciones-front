import { COLORS } from '../constants/colors';
import { RestaurantStaffEnum } from './types';

export const RESTAURANT_STAFF_ROLE_LABELS: Record<RestaurantStaffEnum, string> = {
  [RestaurantStaffEnum.OWNER]: 'Propietario',
  [RestaurantStaffEnum.ADMIN]: 'Admin',
  [RestaurantStaffEnum.CASHIER_PLUS]: 'Cajero Plus',
  [RestaurantStaffEnum.CASHIER]: 'Cajero',
};

export const RESTAURANT_STAFF_ROLE_COLORS: Record<RestaurantStaffEnum, { color: string }> = {
  [RestaurantStaffEnum.OWNER]: { color: COLORS.primary.terracota },
  [RestaurantStaffEnum.ADMIN]: { color: COLORS.primary.caramelo },
  [RestaurantStaffEnum.CASHIER_PLUS]: { color: COLORS.secondary.verde_oliva },
  [RestaurantStaffEnum.CASHIER]: { color: COLORS.common.gris_medio },
};

export const getRestaurantStaffRoleStyle = (role: RestaurantStaffEnum) =>
  RESTAURANT_STAFF_ROLE_COLORS[role] ?? { color: COLORS.common.gris_oscuro };
