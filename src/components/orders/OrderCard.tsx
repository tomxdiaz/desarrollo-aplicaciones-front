import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { BORDER_RADIUS, SPACING } from '../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../constants/font_sizes';
import { COLORS } from '../../constants/colors';
import { router } from 'expo-router';

const OrderCard = ({ order }: { order: any }) => {
  const handlePress = () => {
    router.push(`/my-orders/${order.id}`);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.id}>#{order.id}</Text>
        <Text style={[styles.status, getStatusStyle(order.status)]}>{order.status}</Text>
      </View>
      <Text style={styles.restaurant}>{order.restaurant_name}</Text>
      <View style={styles.row}>
        <Text style={styles.total}>${order.total.toFixed(2)}</Text>
        <Text style={styles.date}>{new Date(order.created_at).toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'PENDING':
      return { color: COLORS.status.advertencia };
    case 'IN_PROCESS':
      return { color: COLORS.primary.caramelo };
    case 'DELIVERED':
      return { color: COLORS.status.exito };
    case 'CANCELLED':
      return { color: COLORS.status.error };
    default:
      return { color: COLORS.common.gris_oscuro };
  }
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
  date: {
    fontSize: FONT_SIZES.text_small,
    color: COLORS.common.gris_medio,
  },
});

export default OrderCard;
