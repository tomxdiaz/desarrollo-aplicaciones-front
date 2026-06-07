import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import { formatPrice } from '../../../utils/menu';
import { getRestaurantOrderStatusStyle, RESTAURANT_ORDER_STATUS_LABELS } from '../../../types/restaurant-order-status';
import { Order, RestaurantOrderStatusEnum, RestaurantTable } from '../../../types/types';

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
}: {
  order: Order;
  table: RestaurantTable | undefined;
  onUpdateStatus: (order: Order, status: RestaurantOrderStatusEnum) => void;
}) => {
  const tableLabel = table ? `Mesa ${table.code}` : 'Mesa eliminada';

  const handleCancel = () => {
    Alert.alert('Cancelar pedido', `¿Cancelar el pedido #${order.number}?`, [
      { text: 'No', style: 'cancel' },
      { text: 'Sí, cancelar', style: 'destructive', onPress: () => onUpdateStatus(order, RestaurantOrderStatusEnum.CANCELLED) },
    ]);
  };

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.title}>
          {tableLabel} · #{order.number}
        </Text>
        <Text style={[styles.status, getRestaurantOrderStatusStyle(order.status)]}>
          {RESTAURANT_ORDER_STATUS_LABELS[order.status]}
        </Text>
      </View>

      <View style={styles.itemsList}>
        {order.items?.map((item) => (
          <Text key={item.id} style={styles.itemText}>
            {item.quantity}× {item.product_name}
          </Text>
        ))}
        {order.note ? <Text style={styles.orderNote}>Nota: {order.note}</Text> : null}
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.elapsed}>{formatElapsed(order.created_at)}</Text>
        <Text style={styles.total}>{formatPrice(order.total)}</Text>
      </View>

      {order.status === RestaurantOrderStatusEnum.PENDING ? (
        <View style={styles.actionsRow}>
          <Pressable style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </Pressable>
          <Pressable
            style={styles.primaryButton}
            onPress={() => onUpdateStatus(order, RestaurantOrderStatusEnum.IN_PROCESS)}
          >
            <Text style={styles.primaryButtonText}>Enviar a cocina</Text>
          </Pressable>
        </View>
      ) : null}

      {order.status === RestaurantOrderStatusEnum.IN_PROCESS ? (
        <View style={styles.actionsRow}>
          <Pressable
            style={styles.primaryButton}
            onPress={() => onUpdateStatus(order, RestaurantOrderStatusEnum.DELIVERED)}
          >
            <Text style={styles.primaryButtonText}>Marcar entregado</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.common.blanco,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.medium,
    gap: SPACING.small,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
    color: COLORS.common.negro_principal,
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
  orderNote: {
    fontSize: FONT_SIZES.text_small,
    fontStyle: 'italic',
    color: COLORS.common.gris_medio,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  elapsed: {
    fontSize: FONT_SIZES.text_small,
    color: COLORS.common.gris_medio,
  },
  total: {
    fontSize: FONT_SIZES.text_base,
    fontWeight: '800',
    color: COLORS.primary.terracota,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: SPACING.small,
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
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
  primaryButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.small,
    borderRadius: BORDER_RADIUS.extra_large,
    backgroundColor: COLORS.primary.terracota,
  },
  primaryButtonText: {
    color: COLORS.common.blanco,
    fontSize: FONT_SIZES.text_small,
    fontWeight: '700',
  },
});

export default StaffOrderCard;
