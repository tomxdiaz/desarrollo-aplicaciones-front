import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../providers/auth.provider';
import { restaurantService } from '../../services/restaurant.service';
import { Restaurant } from '../../types/types';

export default function HomeScreen() {
  const { appUser, signOut } = useAuth();

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

  return (
    <View style={styles.container}>
      {appUser && <Text>Bienvenido, {appUser.email}!</Text>}
      {appUser && <Text>Tu ID es: {appUser.id}!</Text>}
      {appUser && <Text>Tenes el rol: {appUser.global_role}!</Text>}

      {appUser && <Button title='Cerrar sesión' onPress={signOut} />}

      <Button title='Ir a Login' onPress={() => router.navigate('/signin')} />
      <Button title='Ir a Register' onPress={() => router.navigate('/register')} />

      <Text>Provecho!</Text>
      {restaurants.map((restaurant: Restaurant) => (
        <View key={restaurant.id}>
          <Text>{restaurant.name}</Text>
          <Text>{restaurant.address}</Text>
        </View>
      ))}

      <StatusBar style='auto' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
