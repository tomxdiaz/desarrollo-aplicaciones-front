import { RestaurantStaffEnum } from '../types/types';

export const canManageTables = (role: RestaurantStaffEnum) =>
  role === RestaurantStaffEnum.OWNER ||
  role === RestaurantStaffEnum.ADMIN ||
  role === RestaurantStaffEnum.CASHIER_PLUS;

export const canManageMenu = (role: RestaurantStaffEnum) =>
  role === RestaurantStaffEnum.OWNER ||
  role === RestaurantStaffEnum.ADMIN ||
  role === RestaurantStaffEnum.CASHIER_PLUS;

// Every staff role can update order status; only table/staff/menu management is restricted.
export const canUpdateOrderStatus = (_role: RestaurantStaffEnum) => true;

export const canManageMenu = (role: RestaurantStaffEnum) =>
  role === RestaurantStaffEnum.OWNER ||
  role === RestaurantStaffEnum.ADMIN ||
  role === RestaurantStaffEnum.CASHIER_PLUS;

export const canManageStaff = (role: RestaurantStaffEnum) =>
  role === RestaurantStaffEnum.OWNER || role === RestaurantStaffEnum.ADMIN;

// Mirrors the server-side getStaffRoleRank. Backend remains the source of truth.
export const getStaffRoleRank = (role: RestaurantStaffEnum): number => {
  if (role === RestaurantStaffEnum.OWNER) return 4;
  if (role === RestaurantStaffEnum.ADMIN) return 3;
  if (role === RestaurantStaffEnum.CASHIER_PLUS) return 2;
  return 1; // CASHIER
};

// UX gate only — backend re-enforces this server-side.
export const canManageMember = (myRole: RestaurantStaffEnum, theirRole: RestaurantStaffEnum): boolean => {
  if (myRole === RestaurantStaffEnum.OWNER) return true;
  return getStaffRoleRank(myRole) > getStaffRoleRank(theirRole);
};
