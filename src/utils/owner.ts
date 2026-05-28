import { Restaurant } from '../types/types';

export const imIOwner = (restaurant: Restaurant, appUserId: string) => {
  return restaurant.owner_id === appUserId;
};
