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
        console.log('Restaurante obtenido name:', myRestaurant.name);
        const myRestaurantStaffInfo = await restaurantStaffService.getMyRestaurantStaffInfo(id);
        console.log('Información del staff obtenida rol:', myRestaurantStaffInfo.role);
        setMyRestaurantStaffInfo(myRestaurantStaffInfo);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching restaurant:', error);
        setMyRestaurant(null);
        setMyRestaurantStaffInfo(null);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <View>
      <Text>myRestaurant name: {myRestaurant?.name}</Text>
      <Text>myRestaurant rol: {myRestaurantStaffInfo?.role}</Text>;
    </View>
  );

  if (!myRestaurant) {
    return <Text>El restaurante no existe</Text>;
  }

  if (!myRestaurantStaffInfo) {
    return <Text>No formas parte de este restaurante</Text>;
  }

  //   return (
  //     <View>
  //       <Text>{`Restaurant ID: ${myRestaurant.id}`}</Text>
  //       <Text>{myRestaurant.name}</Text>
  //       {/* <Text>{`Mi rol en este restaurante: ${myRestaurantStaffInfo.role}`}</Text> */}
  //     </View>
  //   );
};

export default MyRestaurantDetailScreen;
