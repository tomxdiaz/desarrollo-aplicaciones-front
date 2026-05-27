import { Text, View } from 'react-native';
import { Restaurant, RestaurantStaff } from '../../../types/types';
import { useEffect, useState } from 'react';
import { restaurantService } from '../../../services/restaurant.service';
import { restaurantStaffService } from '../../../services/restaurant_staff.service';

const MyRestaurantDetailScreen = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true);
  const [myRestaurant, setMyRestaurant] = useState<Restaurant | null>();
  const [myRestaurantStaffInfo, setMyRestaurantStaffInfo] = useState<RestaurantStaff | null>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const myRestaurant = await restaurantService.getRestaurantById(id);
        setMyRestaurant(myRestaurant);
        const myRestaurantStaffInfo = await restaurantStaffService.getMyRestaurantStaffInfo(id);
        setMyRestaurantStaffInfo(myRestaurantStaffInfo);
        setLoading(false);
      } catch (error) {
        setMyRestaurant(null);
        setMyRestaurantStaffInfo(null);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!myRestaurant) {
    return <Text>El restaurante no existe</Text>;
  }

  if (!myRestaurantStaffInfo) {
    return <Text>No formas parte de este restaurante</Text>;
  }

  return (
    <View>
      <Text>{`Restaurant ID: ${myRestaurant.id}`}</Text>
      <Text>{myRestaurant.name}</Text>
      <Text>{`Mi rol en este restaurante: ${myRestaurantStaffInfo.role}`}</Text>
    </View>
  );
};

export default MyRestaurantDetailScreen;
