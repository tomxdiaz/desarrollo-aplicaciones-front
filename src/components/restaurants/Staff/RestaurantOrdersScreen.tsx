import { useCallback, useEffect, useState } from 'react';
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
import StaffOrderDetailModal from './StaffOrderDetailModal';

const RestaurantOrdersScreen = ({
  restaurantId,
  tables,
  openOrderForTable,
  onOrderOpened,
}: {
  restaurantId: string;
  tables: RestaurantTable[];
  openOrderForTable: number | null;
  onOrderOpened: () => void;
}) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>(ALL_ORDER_STATUS_FILTER);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const tablesById = new Map(tables.map((table) => [table.id, table]));
  const selectedOrder = orders.find((order) => order.id === selectedOrderId) ?? null;

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

  // When the user taps "Ver pedido" on an occupied table, jump straight to the
  // detail of that table's latest active (pending / in process) order.
  useEffect(() => {
    if (openOrderForTable === null || loading) return;

    const latestActive = orders
      .filter(
        (order) =>
          order.table_id === openOrderForTable &&
          (order.status === RestaurantOrderStatusEnum.PENDING || order.status === RestaurantOrderStatusEnum.IN_PROCESS),
      )
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

    if (latestActive) {
      setSelectedOrderId(latestActive.id);
    }

    onOrderOpened();
  }, [openOrderForTable, loading, orders, onOrderOpened]);

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

  const filteredOrders =
    statusFilter === ALL_ORDER_STATUS_FILTER ? orders : orders.filter((order) => order.status === statusFilter);

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
      <OrderStatusFilterTabs selected={statusFilter} onSelect={setStatusFilter} />

      <FlatList
        data={filteredOrders}
        keyExtractor={(order) => String(order.id)}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[COLORS.primary.terracota]} />}
        renderItem={({ item }) => (
          <StaffOrderCard
            order={item}
            table={tablesById.get(item.table_id)}
            onUpdateStatus={handleUpdateStatus}
            onPress={() => setSelectedOrderId(item.id)}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: SPACING.small }} />}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay pedidos en esta categoría</Text>}
      />

      <StaffOrderDetailModal
        order={selectedOrder}
        table={selectedOrder ? tablesById.get(selectedOrder.table_id) : undefined}
        visible={selectedOrder !== null}
        onClose={() => setSelectedOrderId(null)}
        onUpdateStatus={handleUpdateStatus}
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
