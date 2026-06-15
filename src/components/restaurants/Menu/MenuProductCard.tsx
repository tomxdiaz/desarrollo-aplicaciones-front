import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Product } from '../../../types/types';
import { COLORS } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import { ICON_SIZES } from '../../../constants/icon_sizes';
import { formatPrice } from '../../../utils/menu';
import CartStepper from '../../shared/CartStepper';

type MenuProductCardProps = Readonly<{
  product: Product;
  hasTable: boolean;
  quantity: number;
  onAdd: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}>;

const PLACEHOLDER_IMAGE = require('../../../../assets/images/restaurant.jpg');

const MenuProductCard = ({ product, hasTable, quantity, onAdd, onIncrement, onDecrement }: MenuProductCardProps) => {
  const imageSource = product.image ? { uri: product.image } : PLACEHOLDER_IMAGE;

  let cartControl = null;

  if (hasTable) {
    cartControl =
      quantity === 0 ? (
        <Pressable style={styles.addButton} onPress={onAdd}>
          <AntDesign name='plus' size={ICON_SIZES.extra_small} color={COLORS.primary.terracota} />
        </Pressable>
      ) : (
        <CartStepper quantity={quantity} onIncrement={onIncrement} onDecrement={onDecrement} />
      );
  }

  return (
    <View style={styles.card}>
      <Image source={imageSource} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>

        {product.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {product.description}
          </Text>
        ) : null}

        <Text style={styles.price}>{formatPrice(product.price)}</Text>
      </View>

      {cartControl}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.small,
    padding: SPACING.small,
    borderRadius: BORDER_RADIUS.medium,
    backgroundColor: COLORS.common.blanco,
    borderWidth: 1,
    borderColor: COLORS.common.gris_claro,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: BORDER_RADIUS.small,
  },
  content: {
    flex: 1,
    gap: SPACING.extra_small,
  },
  name: {
    color: COLORS.common.negro_principal,
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
  },
  description: {
    color: COLORS.common.gris_oscuro,
    fontSize: FONT_SIZES.text_small,
  },
  price: {
    color: COLORS.primary.terracota,
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.extra_large,
    borderWidth: 1,
    borderColor: COLORS.primary.terracota,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MenuProductCard;
