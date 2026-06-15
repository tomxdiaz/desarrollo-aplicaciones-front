import { useState, useEffect } from 'react';
import { restaurantService } from '../../services/restaurant.service';
import { Restaurant } from '../../types/types';
import RestaurantsList from './RestaurantsList';
import ScreenLoader from '../shared/ScreenLoader';

const RestaurantsListScreen = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allRestaurants = await restaurantService.getAllRestaurants();
        setRestaurants(allRestaurants);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <ScreenLoader />;
  }

  return <RestaurantsList restaurants={restaurants} />;
};

export default RestaurantsListScreen;
