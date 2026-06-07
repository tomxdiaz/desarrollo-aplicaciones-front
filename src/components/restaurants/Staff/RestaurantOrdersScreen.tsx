import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { orderService } from '../../../services/order.service';
import { ALL_ORDER_STATUS_FILTER, OrderStatusFilter } from '../../../types/restaurant-order-status';
import { Order, RestaurantOrderStatusEnum, RestaurantTable } from '../../../types/types';
import { COLORS } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import OrderStatusFilterTabs from './OrderStatusFilterTabs';
import StaffOrderCard from './StaffOrderCard';

const RestaurantOrdersScreen = ({
  restaurantId,
  tables,
  tableFilter,
  onClearTableFilter,
}: {
  restaurantId: string;
  tables: RestaurantTable[];
  tableFilter: number | null;
  onClearTableFilter: () => void;
}) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>(ALL_ORDER_STATUS_FILTER);

  const tablesById = new Map(tables.map((table) => [table.id, table]));

  const loadOrders = useCallback(async () => {
    try {
      setError(false);
      const data = await orderService.getRestaurantOrders(restaurantId);
      setOrders(data);
    } catch (err) {
      console.error('Error fetching restaurant orders:', err);
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [restaurantId]);

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [loadOrders]),
  );

  const handleRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  const handleUpdateStatus = async (order: Order, status: RestaurantOrderStatusEnum) => {
    try {
      const updated = await orderService.updateOrderStatus(restaurantId, String(order.id), status);
      setOrders((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    } catch (err) {
      console.error('Error updating order status:', err);
      Alert.alert('Error', 'No se pudo actualizar el estado del pedido. Intentá de nuevo.');
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (tableFilter !== null && order.table_id !== tableFilter) return false;
    if (statusFilter !== ALL_ORDER_STATUS_FILTER && order.status !== statusFilter) return false;
    return true;
  });

  const filteredTable = tableFilter !== null ? tablesById.get(tableFilter) : undefined;

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size='large' color={COLORS.primary.terracota} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No se pudieron cargar los pedidos.</Text>
        <Pressable style={styles.retryButton} onPress={loadOrders}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {tableFilter !== null ? (
        <View style={styles.filterChip}>
          <Text style={styles.filterChipText}>Mesa {filteredTable?.code ?? tableFilter}</Text>
          <Pressable onPress={onClearTableFilter}>
            <Text style={styles.filterChipClear}>Quitar filtro ✕</Text>
          </Pressable>
        </View>
      ) : null}

      <OrderStatusFilterTabs selected={statusFilter} onSelect={setStatusFilter} />

      <FlatList
        data={filteredOrders}
        keyExtractor={(order) => String(order.id)}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[COLORS.primary.terracota]} />}
        renderItem={({ item }) => (
          <StaffOrderCard order={item} table={tablesById.get(item.table_id)} onUpdateStatus={handleUpdateStatus} />
        )}
        ItemSeparatorComponent={() => <View style={{ height: SPACING.small }} />}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay pedidos en esta categoría</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.large,
    gap: SPACING.medium,
  },
  errorText: {
    fontSize: FONT_SIZES.text_base,
    color: COLORS.common.gris_oscuro,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: SPACING.large,
    paddingVertical: SPACING.small,
    borderRadius: BORDER_RADIUS.extra_large,
    backgroundColor: COLORS.primary.terracota,
  },
  retryButtonText: {
    color: COLORS.common.blanco,
    fontWeight: '700',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: SPACING.medium,
    marginTop: SPACING.small,
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.small,
    borderRadius: BORDER_RADIUS.extra_large,
    backgroundColor: `${COLORS.primary.arena_calida}66`,
    borderWidth: 1,
    borderColor: COLORS.primary.caramelo,
  },
  filterChipText: {
    fontSize: FONT_SIZES.text_small,
    fontWeight: '700',
    color: COLORS.primary.caramelo,
  },
  filterChipClear: {
    fontSize: FONT_SIZES.text_small,
    fontWeight: '700',
    color: COLORS.primary.caramelo,
  },
  listContent: {
    padding: SPACING.medium,
    paddingBottom: SPACING.extra_large,
  },
  emptyText: {
    fontSize: FONT_SIZES.text_base,
    color: COLORS.common.gris_medio,
    textAlign: 'center',
    marginTop: SPACING.extra_large,
  },
});

export default RestaurantOrdersScreen;
