import { useState, useEffect } from 'react';
import { restaurantService } from '../../services/restaurant.service';
import { Restaurant } from '../../types/types';
import MyRestaurantsList from './MyRestaurantsList';
import ScreenLoader from '../shared/ScreenLoader';

const MyRestaurantsListScreen = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const myRestaurants = await restaurantService.getMyRestaurants();
        setRestaurants(myRestaurants);
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

  return (
    <MyRestaurantsList
      restaurants={restaurants}
      onRestaurantCreated={(restaurant) => setRestaurants((current) => [...current, restaurant])}
    />
  );
};

export default MyRestaurantsListScreen;
