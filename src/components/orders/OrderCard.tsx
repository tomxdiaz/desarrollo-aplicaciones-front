import { StyleSheet, View, Text, TouchableOpacity, Pressable } from 'react-native';
import { BORDER_RADIUS, SPACING } from '../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../constants/font_sizes';
import { COLORS } from '../../constants/colors';
import { router } from 'expo-router';
import { getRestaurantOrderStatusStyle, RESTAURANT_ORDER_STATUS_LABELS } from '../../types/restaurant-order-status';
import { Order } from '../../types/types';

const OrderCard = ({
  order,
  onCancel,
}: {
  order: Order;
  onCancel?: (order: Order) => void;
}) => {
  const handlePress = () => {
    router.push(`/my-orders/${order.id}?restaurantId=${order.restaurant_id}`);
  };

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.id}>#{order.id}</Text>
        <Text style={[styles.status, getRestaurantOrderStatusStyle(order.status)]}>{RESTAURANT_ORDER_STATUS_LABELS[order.status]}</Text>
      </View>
      {order.restaurant && <Text style={styles.restaurant}>{order.restaurant.name}</Text>}
      <View style={styles.actionsRow}>
        <Text style={styles.total}>${order.total.toFixed(2)}</Text>
        <View style={styles.actionsGroup}>
          {order.status === 'PENDING' && onCancel && (
            <Pressable onPress={() => onCancel(order)} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </Pressable>
          )}
          <Pressable onPress={handlePress} style={styles.detailButton}>
            <Text style={styles.detailButtonText}>Ver →</Text>
          </Pressable>
        </View>
      </View>
      <Text style={styles.date}>{new Date(order.created_at).toLocaleDateString('es-AR')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: COLORS.common.blanco,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.medium,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  row: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionsRow: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SPACING.small,
  },
  actionsGroup: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.small,
    flexShrink: 1,
  },
  id: {
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
    color: COLORS.common.negro_principal,
  },
  status: {
    fontSize: FONT_SIZES.text_small,
    fontWeight: '700',
  },
  restaurant: {
    fontSize: FONT_SIZES.text_base,
    color: COLORS.common.gris_oscuro,
    marginVertical: SPACING.small,
  },
  total: {
    fontSize: FONT_SIZES.text_base,
    fontWeight: '800',
    color: COLORS.primary.terracota,
  },
  detailButton: {
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.small,
    borderRadius: BORDER_RADIUS.extra_large,
    borderWidth: 1,
    borderColor: COLORS.primary.caramelo,
    backgroundColor: COLORS.common.blanco,
  },
  detailButtonText: {
    color: COLORS.primary.caramelo,
    fontSize: FONT_SIZES.text_small,
    fontWeight: '700',
  },
  cancelButton: {
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.small,
    borderRadius: BORDER_RADIUS.extra_large,
    borderWidth: 1,
    borderColor: COLORS.status.error,
    backgroundColor: COLORS.common.blanco,
  },
  cancelButtonText: {
    color: COLORS.status.error,
    fontSize: FONT_SIZES.text_small,
    fontWeight: '700',
  },
  date: {
    fontSize: FONT_SIZES.text_small,
    color: COLORS.common.gris_medio,
    marginTop: SPACING.small,
  },
});

export default OrderCard;
