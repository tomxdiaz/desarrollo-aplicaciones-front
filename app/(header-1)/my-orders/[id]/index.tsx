import { useLocalSearchParams } from 'expo-router';
import MyOrderDetailScreen from '../../../../src/components/orders/MyOrderDetailScreen';
import { getParam } from '../../../../src/utils/params';

export default function MyOrderDetailPage() {
  const { id, restaurantId } = useLocalSearchParams();

  return <MyOrderDetailScreen id={getParam(id) ?? ''} restaurantId={getParam(restaurantId) ?? ''} />;
}
