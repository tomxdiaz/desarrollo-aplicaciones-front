import { useLocalSearchParams } from 'expo-router';
import RestaurantDetailScreen from '../../../../src/components/restaurants/Detail/RestaurantDetailScreen';
import { getParam } from '../../../../src/utils/params';

export default function RestaurantDetailPage() {
  const { id } = useLocalSearchParams();

  return <RestaurantDetailScreen id={getParam(id) ?? ''} />;
}
