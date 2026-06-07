import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { Restaurant, RestaurantStaff } from '../../../types/types';
import { restaurantService } from '../../../services/restaurant.service';
import { restaurantStaffService } from '../../../services/restaurant_staff.service';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import StaffTabs, { StaffTabKey } from '../Staff/StaffTabs';
import RestaurantOrdersScreen from '../Staff/RestaurantOrdersScreen';
import RestaurantTablesScreen from '../Staff/RestaurantTablesScreen';

const MyRestaurantDetailScreen = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true);
  const [myRestaurant, setMyRestaurant] = useState<Restaurant | null>(null);
  const [myRestaurantStaffInfo, setMyRestaurantStaffInfo] = useState<RestaurantStaff | null>(null);
  const [activeTab, setActiveTab] = useState<StaffTabKey>('orders');
  const [tableFilter, setTableFilter] = useState<number | null>(null);

  const loadData = useCallback(async () => {
    try {
      const restaurant = await restaurantService.getRestaurantById(id);
      setMyRestaurant(restaurant);
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      setMyRestaurant(null);
      setLoading(false);
      return;
    }

    try {
      const staffInfo = await restaurantStaffService.getMyRestaurantStaffInfo(id);
      setMyRestaurantStaffInfo(staffInfo);
    } catch (error) {
      console.error('Error fetching restaurant staff info:', error);
      setMyRestaurantStaffInfo(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const refreshRestaurant = useCallback(async () => {
    try {
      const restaurant = await restaurantService.getRestaurantById(id);
      setMyRestaurant(restaurant);
    } catch (error) {
      console.error('Error refreshing restaurant:', error);
    }
  }, [id]);

  const handleTablesChange = (tables: Restaurant['tables']) => {
    setMyRestaurant((current) => (current ? { ...current, tables } : current));
  };

  const handleViewOrdersForTable = (tableId: number) => {
    setTableFilter(tableId);
    setActiveTab('orders');
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size='large' color={COLORS.primary.terracota} />
      </View>
    );
  }

  if (!myRestaurant) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>El restaurante no existe</Text>
      </View>
    );
  }

  if (!myRestaurantStaffInfo) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>No formás parte de este restaurante</Text>
      </View>
    );
  }

  const tables = myRestaurant.tables ?? [];

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.restaurantName}>{myRestaurant.name}</Text>
      </View>

      <StaffTabs activeTab={activeTab} onSelect={setActiveTab} />

      {activeTab === 'orders' ? (
        <RestaurantOrdersScreen
          restaurantId={id}
          tables={tables}
          tableFilter={tableFilter}
          onClearTableFilter={() => setTableFilter(null)}
        />
      ) : (
        <RestaurantTablesScreen
          restaurantId={id}
          staffRole={myRestaurantStaffInfo.role}
          tables={tables}
          onTablesChange={handleTablesChange}
          onRefresh={refreshRestaurant}
          onViewOrdersForTable={handleViewOrdersForTable}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.common.gris_muy_claro,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.large,
  },
  message: {
    fontSize: FONT_SIZES.text_base,
    color: COLORS.common.gris_oscuro,
    textAlign: 'center',
  },
  header: {
    paddingHorizontal: SPACING.medium,
    paddingTop: SPACING.medium,
  },
  restaurantName: {
    fontSize: FONT_SIZES.title_small,
    fontWeight: '800',
    color: COLORS.common.negro_principal,
  },
});

export default MyRestaurantDetailScreen;
