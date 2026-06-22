import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import { ICON_SIZES } from '../../../constants/icon_sizes';
import { formatPrice } from '../../../utils/menu';
import { getRestaurantOrderStatusStyle, RESTAURANT_ORDER_STATUS_LABELS } from '../../../types/restaurant-order-status';
import { Order, OrderStatus, PAYMENT_METHOD_LABELS } from '../../../types/order.types';
import { RestaurantTable } from '../../../types/types';

const formatElapsed = (createdAt: string) => {
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000));

  if (minutes < 1) return 'Recién pedido';
  if (minutes < 60) return `Hace ${minutes} min`;

  return `Hace ${Math.floor(minutes / 60)} h`;
};

const StaffOrderCard = ({
  order,
  table,
  onUpdateStatus,
  onPress,
}: {
  order: Order;
  table: RestaurantTable | undefined;
  onUpdateStatus: (order: Order, status: OrderStatus) => void;
  onPress: () => void;
}) => {
  const tableLabel = table ? `Mesa ${table.code}` : 'Mesa eliminada';
  const statusColor = getRestaurantOrderStatusStyle(order.status).color;

  const handleCancel = () => {
    Alert.alert('Cancelar pedido', `¿Cancelar el pedido #${order.number}?`, [
      { text: 'No', style: 'cancel' },
      { text: 'Sí, cancelar', style: 'destructive', onPress: () => onUpdateStatus(order, 'CANCELLED') },
    ]);
  };

  return (
    <Pressable style={styles.card} onPress={onPress} accessibilityRole='button'>
      <View style={styles.row}>
        <View style={styles.titleWrap}>
          <View style={[styles.dot, { backgroundColor: statusColor }]} />
          <Text style={styles.title}>{tableLabel}</Text>
          <Text style={styles.number}>#{order.number}</Text>
        </View>
        <Text style={[styles.status, { color: statusColor }]}>{RESTAURANT_ORDER_STATUS_LABELS[order.status]}</Text>
      </View>

      <View style={styles.itemsList}>
        {order.items?.map((item) => (
          <Text key={item.id} style={styles.itemText}>
            <Text style={styles.itemQty}>{item.quantity}× </Text>
            {item.product_name}
          </Text>
        ))}
        {order.note ? <Text style={styles.orderNote}>Nota: {order.note}</Text> : null}
      </View>

      <View style={styles.divider} />

      <View style={styles.footerRow}>
        <View style={styles.elapsedWrap}>
          <Ionicons name='time-outline' size={ICON_SIZES.extra_small} color={COLORS.common.gris_medio} />
          <Text style={styles.elapsed}>{formatElapsed(order.created_at)}</Text>
        </View>
        <Text style={styles.paymentMethod}>{PAYMENT_METHOD_LABELS[order.payment_method]}</Text>
        <Text style={styles.total}>{formatPrice(order.total)}</Text>
      </View>

      {order.status === 'PENDING' ? (
        <View style={styles.actionsRow}>
          <Pressable style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </Pressable>
          <Pressable style={styles.primaryButton} onPress={() => onUpdateStatus(order, 'IN_PROCESS')}>
            <Text style={styles.primaryButtonText}>Enviar a cocina</Text>
          </Pressable>
        </View>
      ) : null}

      {order.status === 'IN_PROCESS' ? (
        <View style={styles.actionsRow}>
          <Pressable style={[styles.primaryButton, styles.servedButton]} onPress={() => onUpdateStatus(order, 'DELIVERED')}>
            <Text style={styles.primaryButtonText}>Marcar entregado</Text>
          </Pressable>
        </View>
      ) : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.common.blanco,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.medium,
    gap: SPACING.small,
    borderWidth: 1,
    borderColor: COLORS.surface.borde_calido,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.small,
    flexShrink: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  title: {
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
    color: COLORS.common.negro_principal,
  },
  number: {
    fontSize: FONT_SIZES.text_small,
    fontWeight: '600',
    color: COLORS.common.gris_medio,
  },
  status: {
    fontSize: FONT_SIZES.text_small,
    fontWeight: '700',
  },
  itemsList: {
    gap: SPACING.extra_small,
  },
  itemText: {
    fontSize: FONT_SIZES.text_base,
    color: COLORS.common.gris_oscuro,
  },
  itemQty: {
    fontWeight: '700',
    color: COLORS.common.negro_principal,
  },
  orderNote: {
    fontSize: FONT_SIZES.text_small,
    fontStyle: 'italic',
    color: COLORS.common.gris_medio,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.surface.borde_calido,
    marginVertical: SPACING.extra_small,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  elapsedWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.extra_small,
  },
  elapsed: {
    fontSize: FONT_SIZES.text_small,
    color: COLORS.common.gris_medio,
  },
  paymentMethod: {
    fontSize: FONT_SIZES.text_small,
    color: COLORS.common.gris_medio,
  },
  total: {
    fontSize: FONT_SIZES.text_large,
    fontWeight: '800',
    color: COLORS.primary.terracota,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: SPACING.small,
    marginTop: SPACING.small,
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.medium,
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
  primaryButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.medium,
    borderRadius: BORDER_RADIUS.extra_large,
    backgroundColor: COLORS.primary.terracota,
  },
  servedButton: {
    backgroundColor: COLORS.secondary.verde_oliva,
  },
  primaryButtonText: {
    color: COLORS.common.blanco,
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
  },
});

export default StaffOrderCard;
