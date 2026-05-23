import { useLocalSearchParams } from 'expo-router';
import RestaurantMenuScreen from '../../../../src/components/restaurants/Menu/RestaurantMenuScreen';
import { getParam } from '../../../../src/utils/params';

export default function RestaurantMenuPage() {
  const { id, table } = useLocalSearchParams<{ id: string; table?: string | string[] }>();

  return <RestaurantMenuScreen id={getParam(id) ?? ''} tableCode={getParam(table)} />;
}
