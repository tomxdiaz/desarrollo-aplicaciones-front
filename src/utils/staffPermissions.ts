import { RestaurantStaffEnum } from '../types/types';

const canManageRestaurantResources = (role: RestaurantStaffEnum): boolean =>
  role === RestaurantStaffEnum.OWNER || role === RestaurantStaffEnum.ADMIN || role === RestaurantStaffEnum.CASHIER_PLUS;

export const canManageTables = canManageRestaurantResources;

// Every staff role can free up (close) an occupied table; creating/deleting tables stays gated by canManageTables.
export const canFreeTable = (_role: RestaurantStaffEnum): boolean => true;

export const canManageMenu = canManageRestaurantResources;

// Every staff role can view the menu; only creating/editing is gated by canManageMenu.
export const canViewMenu = (_role: RestaurantStaffEnum): boolean => true;

// Every staff role can update order status; only table/staff/menu management is restricted.
export const canUpdateOrderStatus = (_role: RestaurantStaffEnum): boolean => true;

export const canManageStaff = (role: RestaurantStaffEnum): boolean =>
  role === RestaurantStaffEnum.OWNER || role === RestaurantStaffEnum.ADMIN;

export const canEditRestaurant = (role: RestaurantStaffEnum): boolean =>
  role === RestaurantStaffEnum.OWNER || role === RestaurantStaffEnum.ADMIN;

// Mirrors the server-side getStaffRoleRank. Backend remains the source of truth.
export const getStaffRoleRank = (role: RestaurantStaffEnum): number => {
  if (role === RestaurantStaffEnum.OWNER) {
    return 4;
  }

  if (role === RestaurantStaffEnum.ADMIN) {
    return 3;
  }

  if (role === RestaurantStaffEnum.CASHIER_PLUS) {
    return 2;
  }

  return 1;
};

// UX gate only — backend re-enforces this server-side.
export const getAssignableRoles = (role: RestaurantStaffEnum): RestaurantStaffEnum[] => {
  if (role === RestaurantStaffEnum.OWNER) {
    return [RestaurantStaffEnum.ADMIN, RestaurantStaffEnum.CASHIER_PLUS, RestaurantStaffEnum.CASHIER];
  }

  if (role === RestaurantStaffEnum.ADMIN) {
    return [RestaurantStaffEnum.CASHIER_PLUS, RestaurantStaffEnum.CASHIER];
  }

  return [];
};

// UX gate only — backend re-enforces this server-side.
export const canManageMember = (myRole: RestaurantStaffEnum, theirRole: RestaurantStaffEnum): boolean => {
  if (myRole === RestaurantStaffEnum.OWNER) {
    return true;
  }

  return getStaffRoleRank(myRole) > getStaffRoleRank(theirRole);
};
