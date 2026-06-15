import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { orderService } from '../../../services/order.service';
import { ALL_ORDER_STATUS_FILTER, OrderStatusFilter } from '../../../types/restaurant-order-status';
import { Order, OrderStatus } from '../../../types/order.types';
import { RestaurantTable } from '../../../types/types';
import { COLORS } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import OrderStatusFilterTabs from './OrderStatusFilterTabs';
import StaffOrderCard from './StaffOrderCard';
import StaffOrderDetailModal from './StaffOrderDetailModal';

type RestaurantOrdersScreenProps = Readonly<{
  restaurantId: string;
  tables: RestaurantTable[];
  openOrderForTable: number | null;
  onOrderOpened: () => void;
}>;

const OrderItemSeparator = () => <View style={styles.itemSeparator} />;

const RestaurantOrdersScreen = ({ restaurantId, tables, openOrderForTable, onOrderOpened }: RestaurantOrdersScreenProps) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>(ALL_ORDER_STATUS_FILTER);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const tablesById = useMemo(() => new Map(tables.map((table) => [table.id, table])), [tables]);

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
      loadOrders().catch((err) => {
        console.error('Unexpected error loading restaurant orders:', err);
      });
    }, [loadOrders]),
  );

  useEffect(() => {
    if (openOrderForTable === null || loading) {
      return;
    }

    const latestActiveOrder = orders
      .filter((order) => order.table_id === openOrderForTable && (order.status === 'PENDING' || order.status === 'IN_PROCESS'))
      .sort((firstOrder, secondOrder) => new Date(secondOrder.created_at).getTime() - new Date(firstOrder.created_at).getTime())[0];

    if (latestActiveOrder) {
      setSelectedOrderId(latestActiveOrder.id);
    }

    onOrderOpened();
  }, [openOrderForTable, loading, orders, onOrderOpened]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);

    loadOrders().catch((err) => {
      console.error('Unexpected error refreshing restaurant orders:', err);
    });
  }, [loadOrders]);

  const handleUpdateStatus = useCallback(
    async (order: Order, status: OrderStatus) => {
      try {
        const updatedOrder = await orderService.updateOrderStatus(restaurantId, String(order.id), status);

        setOrders((currentOrders) =>
          currentOrders.map((currentOrder) => (currentOrder.id === updatedOrder.id ? updatedOrder : currentOrder)),
        );
      } catch (err) {
        console.error('Error updating order status:', err);

        Alert.alert('Error', 'No se pudo actualizar el estado del pedido. Intentá de nuevo.');
      }
    },
    [restaurantId],
  );

  const filteredOrders = useMemo(
    () => (statusFilter === ALL_ORDER_STATUS_FILTER ? orders : orders.filter((order) => order.status === statusFilter)),
    [orders, statusFilter],
  );

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

        <Pressable
          style={styles.retryButton}
          onPress={() => {
            loadOrders().catch((err) => {
              console.error('Unexpected error retrying restaurant orders:', err);
            });
          }}>
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
        ItemSeparatorComponent={OrderItemSeparator}
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
  itemSeparator: {
    height: SPACING.small,
  },
  emptyText: {
    fontSize: FONT_SIZES.text_base,
    color: COLORS.common.gris_medio,
    textAlign: 'center',
    marginTop: SPACING.extra_large,
  },
});

export default RestaurantOrdersScreen;
