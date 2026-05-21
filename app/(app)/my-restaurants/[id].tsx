import { useLocalSearchParams } from 'expo-router';
import MyRestaurantDetailScreen from '../../../src/components/restaurants/Detail/MyRestaurantDetailScreen';

export default function RestaurantDetailPage() {
  const { id } = useLocalSearchParams();

  return <MyRestaurantDetailScreen id={id as string} />;
}
