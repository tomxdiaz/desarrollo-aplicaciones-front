import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import { ICON_SIZES } from '../../../constants/icon_sizes';
import { formatPrice } from '../../../utils/menu';
import { getRestaurantOrderStatusStyle, RESTAURANT_ORDER_STATUS_LABELS } from '../../../types/restaurant-order-status';
import { Order, OrderStatus } from '../../../types/order.types';
import { RestaurantTable } from '../../../types/types';

const formatDateTime = (createdAt: string) =>
  new Date(createdAt).toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

const StaffOrderDetailModal = ({
  order,
  table,
  visible,
  onClose,
  onUpdateStatus,
}: {
  order: Order | null;
  table: RestaurantTable | undefined;
  visible: boolean;
  onClose: () => void;
  onUpdateStatus: (order: Order, status: OrderStatus) => void;
}) => {
  const statusColor = order ? getRestaurantOrderStatusStyle(order.status).color : COLORS.common.gris_oscuro;
  const tableLabel = table ? `Mesa ${table.code}` : 'Mesa eliminada';

  const handleCancel = () => {
    if (!order) return;

    Alert.alert('Cancelar pedido', `¿Cancelar el pedido #${order.number}?`, [
      { text: 'No', style: 'cancel' },
      {
        text: 'Sí, cancelar',
        style: 'destructive',
        onPress: () => onUpdateStatus(order, 'CANCELLED'),
      },
    ]);
  };

  return (
    <Modal visible={visible} transparent animationType='fade' onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        {/* Inner press is captured so tapping the sheet doesn't close the modal. */}
        <Pressable style={styles.sheet} onPress={() => {}}>
          {order ? (
            <>
              <View style={styles.header}>
                <View style={styles.headerTexts}>
                  <Text style={styles.title}>Pedido #{order.number}</Text>
                  <Text style={styles.subtitle}>
                    {tableLabel} · {formatDateTime(order.created_at)}
                  </Text>
                </View>
                <Pressable
                  style={styles.closeButton}
                  onPress={onClose}
                  accessibilityRole='button'
                  accessibilityLabel='Cerrar'>
                  <Ionicons name='close' size={ICON_SIZES.small} color={COLORS.common.gris_oscuro} />
                </Pressable>
              </View>

              <View style={[styles.statusChip, { backgroundColor: `${statusColor}1A` }]}>
                <View style={[styles.dot, { backgroundColor: statusColor }]} />
                <Text style={[styles.statusText, { color: statusColor }]}>
                  {RESTAURANT_ORDER_STATUS_LABELS[order.status]}
                </Text>
              </View>

              <ScrollView style={styles.itemsScroll} contentContainerStyle={styles.itemsList} showsVerticalScrollIndicator={false}>
                {order.items?.map((item) => (
                  <View key={item.id} style={styles.itemRow}>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>
                        <Text style={styles.itemQty}>{item.quantity}× </Text>
                        {item.product_name}
                      </Text>
                      <Text style={styles.itemUnit}>{formatPrice(item.unit_price)} c/u</Text>
                    </View>
                    <Text style={styles.itemSubtotal}>{formatPrice(item.subtotal)}</Text>
                  </View>
                ))}
                {order.note ? (
                  <View style={styles.noteBox}>
                    <Text style={styles.noteLabel}>Nota</Text>
                    <Text style={styles.noteText}>{order.note}</Text>
                  </View>
                ) : null}
              </ScrollView>

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{formatPrice(order.total)}</Text>
              </View>

              {order.status === 'PENDING' ? (
                <View style={styles.actionsRow}>
                  <Pressable style={styles.cancelButton} onPress={handleCancel}>
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </Pressable>
                  <Pressable
                    style={styles.primaryButton}
                    onPress={() => onUpdateStatus(order, 'IN_PROCESS')}>
                    <Text style={styles.primaryButtonText}>Enviar a cocina</Text>
                  </Pressable>
                </View>
              ) : null}

              {order.status === 'IN_PROCESS' ? (
                <View style={styles.actionsRow}>
                  <Pressable
                    style={[styles.primaryButton, styles.servedButton]}
                    onPress={() => onUpdateStatus(order, 'DELIVERED')}>
                    <Text style={styles.primaryButtonText}>Marcar entregado</Text>
                  </Pressable>
                </View>
              ) : null}
            </>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.surface.fondo_crema,
    borderTopLeftRadius: BORDER_RADIUS.large,
    borderTopRightRadius: BORDER_RADIUS.large,
    padding: SPACING.large,
    gap: SPACING.medium,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: SPACING.small,
  },
  headerTexts: {
    flexShrink: 1,
    gap: SPACING.extra_small,
  },
  title: {
    fontSize: FONT_SIZES.title_small,
    fontWeight: '800',
    color: COLORS.common.negro_principal,
  },
  subtitle: {
    fontSize: FONT_SIZES.text_small,
    color: COLORS.common.gris_medio,
  },
  closeButton: {
    width: ICON_SIZES.large,
    height: ICON_SIZES.large,
    borderRadius: ICON_SIZES.large,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.common.blanco,
    borderWidth: 1,
    borderColor: COLORS.surface.borde_calido,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.small,
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.small,
    borderRadius: BORDER_RADIUS.extra_large,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  statusText: {
    fontSize: FONT_SIZES.text_small,
    fontWeight: '700',
  },
  itemsScroll: {
    flexGrow: 0,
    flexShrink: 1,
  },
  itemsList: {
    gap: SPACING.small,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.medium,
    backgroundColor: COLORS.common.blanco,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1,
    borderColor: COLORS.surface.borde_calido,
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.small,
  },
  itemInfo: {
    flexShrink: 1,
    gap: SPACING.extra_small,
  },
  itemName: {
    fontSize: FONT_SIZES.text_base,
    color: COLORS.common.gris_oscuro,
  },
  itemQty: {
    fontWeight: '700',
    color: COLORS.common.negro_principal,
  },
  itemUnit: {
    fontSize: FONT_SIZES.text_small,
    color: COLORS.common.gris_medio,
  },
  itemSubtotal: {
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
    color: COLORS.common.negro_principal,
  },
  noteBox: {
    gap: SPACING.extra_small,
    backgroundColor: `${COLORS.primary.arena_calida}33`,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.medium,
  },
  noteLabel: {
    fontSize: FONT_SIZES.text_small,
    fontWeight: '700',
    color: COLORS.primary.caramelo,
  },
  noteText: {
    fontSize: FONT_SIZES.text_base,
    color: COLORS.common.gris_oscuro,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING.small,
    borderTopWidth: 1,
    borderTopColor: COLORS.surface.borde_calido,
  },
  totalLabel: {
    fontSize: FONT_SIZES.text_large,
    fontWeight: '800',
    color: COLORS.common.negro_principal,
  },
  totalValue: {
    fontSize: FONT_SIZES.text_large,
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
    paddingVertical: SPACING.medium,
    borderRadius: BORDER_RADIUS.extra_large,
    borderWidth: 1,
    borderColor: COLORS.status.error,
    backgroundColor: COLORS.common.blanco,
  },
  cancelButtonText: {
    color: COLORS.status.error,
    fontSize: FONT_SIZES.text_base,
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

export default StaffOrderDetailModal;
