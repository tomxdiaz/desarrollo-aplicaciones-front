import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/restaurant`;

  const [restaurants, setRestaurants] = useState([]);

  const [text, setText] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(url);
        const data = await res.json();
        setRestaurants(data);
        setText(JSON.stringify(data));
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
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
