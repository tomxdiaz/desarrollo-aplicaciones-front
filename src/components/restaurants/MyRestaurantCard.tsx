import RestaurantCard from './RestaurantCard';
import type { Restaurant } from '../../types/types';

/** Thin wrapper that navigates to the owner/admin restaurant route. */
const MyRestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => (
  <RestaurantCard restaurant={restaurant} routePrefix='/my-restaurants' />
);

export default MyRestaurantCard;
