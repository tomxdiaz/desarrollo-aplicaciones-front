import { Pressable, StyleSheet, Text, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { COLORS } from '../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../constants/font_sizes';
import { ICON_SIZES } from '../../constants/icon_sizes';

type CartStepperProps = {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
};

const CartStepper = ({ quantity, onDecrement, onIncrement }: CartStepperProps) => {
  return (
    <View style={styles.stepper}>
      <Pressable
        style={[styles.button, quantity === 0 && styles.buttonDisabled]}
        onPress={onDecrement}
        disabled={quantity === 0}
      >
        <AntDesign name='minus' size={ICON_SIZES.extra_small} color={COLORS.primary.terracota} />
      </Pressable>
      <Text style={styles.quantity}>{quantity}</Text>
      <Pressable style={styles.button} onPress={onIncrement}>
        <AntDesign name='plus' size={ICON_SIZES.extra_small} color={COLORS.primary.terracota} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.extra_small,
  },
  button: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.extra_large,
    borderWidth: 1,
    borderColor: COLORS.primary.terracota,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  quantity: {
    color: COLORS.primary.terracota,
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
    minWidth: 20,
    textAlign: 'center',
  },
});

export default CartStepper;
