import { RestaurantStaffEnum } from '../types/types';

export const canManageTables = (role: RestaurantStaffEnum) =>
  role === RestaurantStaffEnum.OWNER ||
  role === RestaurantStaffEnum.ADMIN ||
  role === RestaurantStaffEnum.CASHIER_PLUS;

// every staff role can update order status — only table/staff management is restricted
export const canUpdateOrderStatus = (_role: RestaurantStaffEnum) => true;

export const canManageStaff = (role: RestaurantStaffEnum) =>
  role === RestaurantStaffEnum.OWNER || role === RestaurantStaffEnum.ADMIN;
