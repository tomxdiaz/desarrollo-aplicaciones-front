import { useLocalSearchParams } from 'expo-router';
import MyRestaurantDetailScreen from '../../../src/components/restaurants/Detail/MyRestaurantDetailScreen';
import { getParam } from '../../../src/utils/params';

export default function RestaurantDetailPage() {
  const { id } = useLocalSearchParams();

  return <MyRestaurantDetailScreen id={getParam(id) ?? ''} />;
}
