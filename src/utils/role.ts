import { AppRoleEnum, AppUser } from '../types/types';

export const isRole = (appUser: AppUser, roles: AppRoleEnum[]) => {
  return roles.includes(appUser.global_role);
};
