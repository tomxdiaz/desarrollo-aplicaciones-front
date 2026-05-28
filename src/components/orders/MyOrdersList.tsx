import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { BORDER_RADIUS, SPACING } from '../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../constants/font_sizes';
import { COLORS } from '../../constants/colors';
import OrderCard from './OrderCard';
import { useState } from 'react';
import { ALL_ORDER_STATUS_FILTER, ORDER_STATUS_FILTER_OPTIONS, OrderStatusFilter } from '../../types/restaurant-order-status';
import { Order } from '../../types/types';

const MyOrdersList = ({ orders }: { orders: Order[] }) => {
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>(ALL_ORDER_STATUS_FILTER);

  const filtered = orders.filter((o) => (statusFilter === ALL_ORDER_STATUS_FILTER ? true : o.status === statusFilter));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis pedidos</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterBarContent}
        style={styles.filterBar}
        contentInsetAdjustmentBehavior='never'
        alwaysBounceVertical={false}>
        {ORDER_STATUS_FILTER_OPTIONS.map((s) => (
          <Pressable
            key={s.key}
            onPress={() => setStatusFilter(s.key)}
            style={[styles.filterButton, statusFilter === s.key && styles.filterButtonActive]}>
            <Text style={[styles.filterText, statusFilter === s.key && styles.filterTextActive]}>{s.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.list}>
        {filtered && filtered.length > 0 ? (
          filtered.map((order) => <OrderCard key={order.id} order={order} />)
        ) : (
          <Text style={styles.emptyText}>{'No tienes pedidos aún.'}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: SPACING.large,
  },
  title: {
    fontSize: FONT_SIZES.title_base,
    fontWeight: '800',
    color: COLORS.primary.terracota,
  },
  filterBar: {
    width: '100%',
    height: 44,
    maxHeight: 44,
    alignSelf: 'flex-start',
    marginTop: SPACING.small,
    flexShrink: 0,
  },
  filterBarContent: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    alignItems: 'center',
  },
  filterButton: {
    paddingVertical: SPACING.small,
    paddingHorizontal: SPACING.medium,
    borderRadius: BORDER_RADIUS.small,
    backgroundColor: COLORS.common.gris_muy_claro,
    marginRight: SPACING.small,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary.terracota,
  },
  filterText: {
    color: COLORS.common.gris_oscuro,
    fontSize: FONT_SIZES.text_small,
    fontWeight: '600',
  },
  filterTextActive: {
    color: COLORS.common.blanco,
  },
  list: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    paddingTop: SPACING.medium,
  },
  emptyText: {
    fontSize: FONT_SIZES.text_large,
    color: COLORS.common.gris_oscuro,
    marginTop: SPACING.medium,
  },
});

export default MyOrdersList;
