import { useLocalSearchParams } from 'expo-router';
import RestaurantDetailScreen from '../../../src/components/restaurants/Detail/RestaurantDetailScreen';

export default function RestaurantDetailPage() {
  const { id } = useLocalSearchParams();

  return <RestaurantDetailScreen id={id as string} />;
}
