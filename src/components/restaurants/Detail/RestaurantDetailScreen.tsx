import { Text, View } from 'react-native';
import { Restaurant } from '../../../types/types';
import { useEffect, useState } from 'react';
import { restaurantService } from '../../../services/restaurant.service';

const RestaurantDetailScreen = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState<Restaurant | null>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const restaurant = await restaurantService.getRestaurantById(id);
        setRestaurant(restaurant);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching restaurant:', error);
        setRestaurant(null);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!restaurant) {
    return;
  }

  return (
    <View>
      <Text>{`Restaurant ID: ${restaurant.id}`}</Text>
      <Text>{restaurant.name}</Text>
      {restaurant.menu?.categories?.map((category) => {
        return <Text key={category.id}>{category.name}</Text>;
      })}
    </View>
  );
};

export default RestaurantDetailScreen;
