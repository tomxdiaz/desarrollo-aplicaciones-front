import { useState, useEffect } from 'react';
import { restaurantService } from '../../services/restaurant.service';
import { Restaurant } from '../../types/types';
import MyRestaurantsList from './MyRestaurantsList';

const MyRestaurantsListScreen = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const myRestaurants = await restaurantService.getMyRestaurants();
        setRestaurants(myRestaurants);
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

  return (
    <MyRestaurantsList
      restaurants={restaurants}
      onRestaurantCreated={(restaurant) => setRestaurants((current) => [...current, restaurant])}
    />
  );
};

export default MyRestaurantsListScreen;
