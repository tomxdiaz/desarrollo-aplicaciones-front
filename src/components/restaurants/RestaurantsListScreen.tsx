import { useState, useEffect } from 'react';
import { restaurantService } from '../../services/restaurant.service';
import { Restaurant } from '../../types/types';
import RestaurantsList from './RestaurantsList';

const RestaurantsListScreen = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allRestaurants = await restaurantService.getAllRestaurants();
        setRestaurants(allRestaurants);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        setRestaurants([]);
      }
    };

    fetchData();
  }, []);

  if (!restaurants) {
    return;
  }

  return <RestaurantsList restaurants={restaurants} />;
};

export default RestaurantsListScreen;
