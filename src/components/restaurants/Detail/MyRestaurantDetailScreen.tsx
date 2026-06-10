import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useHeaderRestaurant } from '../../../providers/header-restaurant.provider';
import { useAuth } from '../../../providers/auth.provider';
import { AppRoleEnum, Restaurant, RestaurantStaff, RestaurantStaffEnum } from '../../../types/types';
import { restaurantService } from '../../../services/restaurant.service';
import { restaurantStaffService } from '../../../services/restaurant_staff.service';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import StaffTabs, { StaffTabKey } from '../Staff/StaffTabs';
import RestaurantOrdersScreen from '../Staff/RestaurantOrdersScreen';
import RestaurantTablesScreen from '../Staff/RestaurantTablesScreen';
import RestaurantMenuManagementScreen from '../Staff/RestaurantMenuManagementScreen';

const MyRestaurantDetailScreen = ({ id }: { id: string }) => {
  const { appUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [myRestaurant, setMyRestaurant] = useState<Restaurant | null>(null);
  const [myRestaurantStaffInfo, setMyRestaurantStaffInfo] = useState<RestaurantStaff | null>(null);
  const [activeTab, setActiveTab] = useState<StaffTabKey>('orders');
  const [openOrderForTable, setOpenOrderForTable] = useState<number | null>(null);
  const { setRestaurantName } = useHeaderRestaurant();

  const loadData = useCallback(async () => {
    let restaurant: Restaurant;

    try {
      restaurant = await restaurantService.getRestaurantById(id);
      setMyRestaurant(restaurant);
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      setMyRestaurant(null);
      setLoading(false);
      return;
    }

    const isRestaurantOwner = Boolean(appUser && appUser.id === restaurant.owner_id);
    const isSuperUser = appUser?.global_role === AppRoleEnum.SUPER_USER;

    if (isRestaurantOwner || isSuperUser) {
      setMyRestaurantStaffInfo(null);
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
  }, [appUser, id]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  useEffect(() => {
    setRestaurantName(myRestaurant?.name ?? null);
    return () => setRestaurantName(null);
  }, [myRestaurant?.name, setRestaurantName]);

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
    setOpenOrderForTable(tableId);
    setActiveTab('orders');
  };

  const handleOrderOpened = useCallback(() => setOpenOrderForTable(null), []);

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

  const isRestaurantOwner = Boolean(appUser && appUser.id === myRestaurant.owner_id);
  const isSuperUser = appUser?.global_role === AppRoleEnum.SUPER_USER;
  const effectiveStaffRole =
    myRestaurantStaffInfo?.role ?? (isRestaurantOwner || isSuperUser ? RestaurantStaffEnum.OWNER : null);

  if (!effectiveStaffRole) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>No formas parte de este restaurante</Text>
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
          openOrderForTable={openOrderForTable}
          onOrderOpened={handleOrderOpened}
        />
      ) : activeTab === 'tables' ? (
        <RestaurantTablesScreen
          restaurantId={id}
          staffRole={effectiveStaffRole}
          tables={tables}
          onTablesChange={handleTablesChange}
          onRefresh={refreshRestaurant}
          onViewOrdersForTable={handleViewOrdersForTable}
        />
      ) : (
        <RestaurantMenuManagementScreen
          restaurantId={id}
          staffRole={effectiveStaffRole}
          menu={myRestaurant.menu}
          onRefresh={refreshRestaurant}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.surface.fondo_crema,
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
    paddingTop: SPACING.large,
    paddingBottom: SPACING.small,
  },
  restaurantName: {
    fontSize: FONT_SIZES.title_base,
    fontWeight: '800',
    color: COLORS.common.negro_principal,
    letterSpacing: 0.2,
  },
});

export default MyRestaurantDetailScreen;
