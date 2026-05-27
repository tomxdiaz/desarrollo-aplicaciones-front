import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Restaurant, RestaurantStaff } from '../../../types/types';
import { restaurantService } from '../../../services/restaurant.service';
import { restaurantStaffService } from '../../../services/restaurant_staff.service';

const MyRestaurantDetailScreen = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true);
  const [myRestaurant, setMyRestaurant] = useState<Restaurant | null>(null);
  const [myRestaurantStaffInfo, setMyRestaurantStaffInfo] = useState<RestaurantStaff | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const restaurant = await restaurantService.getRestaurantById(id);
        setMyRestaurant(restaurant);
      } catch (error) {
        setMyRestaurant(null);
        setLoading(false);
        return;
      }

      try {
        const staffInfo = await restaurantStaffService.getMyRestaurantStaffInfo(id);

        setMyRestaurantStaffInfo(staffInfo);
      } catch (error) {
        console.error('Error fetching restaurant staff info:', error);
        setMyRestaurantStaffInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando restaurante...</Text>
      </View>
    );
  }

  if (!myRestaurant) {
    return (
      <View style={styles.container}>
        <Text>El restaurante no existe</Text>
      </View>
    );
  }

  if (!myRestaurantStaffInfo) {
    return (
      <View style={styles.container}>
        <Text>No formas parte de este restaurante</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>myRestaurant name: {myRestaurant.name}</Text>
      <Text>myRestaurant rol: {myRestaurantStaffInfo.role}</Text>
    </View>
  );
};

export default MyRestaurantDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
