import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Product } from '../../../types/types';
import { COLORS } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import { ICON_SIZES } from '../../../constants/icon_sizes';
import AntDesign from '@expo/vector-icons/AntDesign';
import { formatPrice } from './menu.utils';

type MenuProductCardProps = {
  product: Product;
  hasTable: boolean;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
};

const PLACEHOLDER_IMAGE = require('../../../../assets/images/restaurant.jpg');

const MenuProductCard = ({ product, hasTable, quantity, onIncrement, onDecrement }: MenuProductCardProps) => {
  const imageSource = product.image ? { uri: product.image } : PLACEHOLDER_IMAGE;



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
      {hasTable ? (
        <View style={styles.stepper}>
          <Pressable style={styles.stepperButton} onPress={onDecrement}>
            <AntDesign name='minus' size={ICON_SIZES.small} color={COLORS.primary.terracota} />2
          </Pressable>
          <Text style={styles.quantity}>{quantity}</Text>
          <Pressable style={styles.stepperButton} onPress={onIncrement}>
            <AntDesign name='plus' size={ICON_SIZES.small} color={COLORS.primary.terracota} />
          </Pressable>
        </View>
      ) : null}
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
  stepper: {
    alignItems: 'center',
    gap: SPACING.extra_small,
  },
  stepperButton: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.extra_large,
    borderWidth: 1,
    borderColor: COLORS.primary.terracota,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantity: {
    color: COLORS.primary.terracota,
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
    minWidth: 20,
    textAlign: 'center',
  },
});

export default MenuProductCard;
