import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { orderService } from '../../services/order.service';
import { restaurantService } from '../../services/restaurant.service';
import { COLORS } from '../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../constants/font_sizes';
import OrderItemCard from './OrderItemCard';
import { Order } from '../../types/order.types';

const STATUS_LABELS: Record<Order['status'], string> = {
  PENDING: 'Pendiente',
  IN_PROCESS: 'En proceso',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
};

const STATUS_COLORS: Record<Order['status'], string> = {
  PENDING: COLORS.status.advertencia,
  IN_PROCESS: COLORS.primary.caramelo,
  DELIVERED: COLORS.status.exito,
  CANCELLED: COLORS.status.error,
};

const MyOrderDetailScreen = ({ id, restaurantId }: { id: string; restaurantId: string }) => {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [restaurantName, setRestaurantName] = useState('');
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const response = await orderService.getMyOrderById(id);

        if (!mounted) return;

        setOrder(response);

        try {
          const restaurant = await restaurantService.getRestaurantById(String(response.restaurant_id));
          if (mounted) {
            setRestaurantName(restaurant.name);
          }
        } catch {
          if (mounted) {
            setRestaurantName(`Restaurante #${response.restaurant_id}`);
          }
        }
      } catch (error) {
        console.error('Error fetching order detail:', error);
        if (mounted) {
          setOrder(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [id, restaurantId]);

  const formattedDate = useMemo(() => {
    if (!order?.created_at) return '';

    return new Date(order.created_at).toLocaleDateString('es-AR');
  }, [order?.created_at]);

  const handleCancelOrder = async () => {
    if (!order || order.status !== 'PENDING' || cancelling) {
      return;
    }

    try {
      setCancelling(true);
      const updatedOrder = await orderService.cancelMyOrder(String(order.id));
      setOrder(updatedOrder);
    } catch (error) {
      console.error('Error cancelling order:', error);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={COLORS.primary.terracota} />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No se pudo cargar el pedido.</Text>
        <Pressable style={styles.backButton} onPress={() => router.push('/my-orders')}>
          <Text style={styles.backButtonText}>Volver a mis pedidos</Text>
        </Pressable>
      </View>
    );
  }

  const items = order.items ?? [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Pedido Nro #{String(order.number).padStart(3, '0')}</Text>

      <View style={styles.metaRow}>
        <View style={[styles.statusChip, { backgroundColor: `${STATUS_COLORS[order.status]}15` }]}>
          <Text style={[styles.statusText, { color: STATUS_COLORS[order.status] }]}>{STATUS_LABELS[order.status]}</Text>
        </View>
        <Text style={styles.dateText}>{formattedDate}</Text>
      </View>

      {order.status === 'PENDING' && (
        <Pressable style={[styles.cancelButton, cancelling && styles.cancelButtonDisabled]} onPress={handleCancelOrder} disabled={cancelling}>
          <Text style={styles.cancelButtonText}>{cancelling ? 'Cancelando...' : 'Cancelar pedido'}</Text>
        </Pressable>
      )}

      <Text style={styles.restaurantText}>{restaurantName}</Text>

      <View style={styles.itemsList}>
        {items.map((item) => (
          <OrderItemCard key={item.id} item={item} />
        ))}
      </View>

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalValue}>${order.total.toFixed(0)}</Text>
      </View>

      <Pressable style={styles.backButton} onPress={() => router.push('/my-orders')}>
        <Text style={styles.backButtonText}>Volver a mis pedidos</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.common.gris_muy_claro,
  },
  contentContainer: {
    padding: SPACING.large,
    gap: SPACING.medium,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.large,
    gap: SPACING.medium,
  },
  title: {
    fontSize: FONT_SIZES.title_small,
    fontWeight: '800',
    color: COLORS.common.negro_principal,
    textAlign: 'center',
    marginTop: SPACING.small,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.medium,
    flexWrap: 'wrap',
  },
  statusChip: {
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.small,
    borderRadius: BORDER_RADIUS.extra_large,
  },
  statusText: {
    fontSize: FONT_SIZES.text_small,
    fontWeight: '700',
  },
  dateText: {
    color: COLORS.common.gris_oscuro,
    fontSize: FONT_SIZES.text_base,
  },
  restaurantText: {
    color: COLORS.common.gris_oscuro,
    fontSize: FONT_SIZES.text_base,
  },
  itemsList: {
    gap: SPACING.medium,
  },
  totalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.common.blanco,
    borderRadius: BORDER_RADIUS.medium,
    paddingHorizontal: SPACING.large,
    paddingVertical: SPACING.medium,
    borderWidth: 1,
    borderColor: COLORS.common.gris_claro,
  },
  totalLabel: {
    fontSize: FONT_SIZES.text_large,
    fontWeight: '800',
    color: COLORS.common.negro_principal,
  },
  totalValue: {
    fontSize: FONT_SIZES.text_large,
    fontWeight: '800',
    color: COLORS.primary.caramelo,
  },
  backButton: {
    height: 56,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1,
    borderColor: COLORS.primary.caramelo,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.common.blanco,
  },
  backButtonText: {
    fontSize: FONT_SIZES.text_large,
    fontWeight: '700',
    color: COLORS.primary.caramelo,
  },
  cancelButton: {
    height: 56,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1,
    borderColor: COLORS.status.error,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.common.blanco,
  },
  cancelButtonDisabled: {
    opacity: 0.6,
  },
  cancelButtonText: {
    fontSize: FONT_SIZES.text_large,
    fontWeight: '700',
    color: COLORS.status.error,
  },
  errorText: {
    fontSize: FONT_SIZES.text_large,
    color: COLORS.common.gris_oscuro,
    textAlign: 'center',
  },
});

export default MyOrderDetailScreen;
