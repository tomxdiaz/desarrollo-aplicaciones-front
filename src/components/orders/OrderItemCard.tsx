import { Image, StyleSheet, Text, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { BORDER_RADIUS, SPACING } from '../../constants/spacing_and_borders';
import { COLORS } from '../../constants/colors';
import { FONT_SIZES } from '../../constants/font_sizes';
import { OrderItem } from '../../types/order.types';

const OrderItemCard = ({ item }: { item: OrderItem }) => {
  return (
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        {item.product_image ? (
          <Image source={{ uri: item.product_image }} style={styles.image} />
        ) : (
          <AntDesign name="fork" size={18} color={COLORS.secondary.verde_oliva} />
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{item.product_name}</Text>
        <Text style={styles.subtitle}>
          ${item.unit_price} x {item.quantity} (${item.subtotal})
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.medium,
    backgroundColor: COLORS.common.blanco,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.medium,
    borderWidth: 1,
    borderColor: COLORS.common.gris_claro,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: COLORS.common.gris_muy_claro,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
  },
  title: {
    color: COLORS.common.negro_principal,
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 2,
    color: COLORS.common.gris_oscuro,
    fontSize: FONT_SIZES.text_small,
  },
});

export default OrderItemCard;
