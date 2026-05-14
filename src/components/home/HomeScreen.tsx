import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../providers/auth.provider';

export default function HomeScreen() {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/restaurant`;

  const { user, session, loading } = useAuth();

  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(url);
        const data = await res.json();
        setRestaurants(data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        setRestaurants([]);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Bienvenido, {user?.email}!</Text>
      <Button title='Ir a Login' onPress={() => router.push('/login')} />
      <Button title='Ir a Register' onPress={() => router.push('/register')} />

      <Text>Provecho!</Text>
      <Text>URL: {url}</Text>
      {restaurants.map((restaurant: any) => (
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
