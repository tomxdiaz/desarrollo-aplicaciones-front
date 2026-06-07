import { useCallback } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useCart } from '../../providers/cart.provider';
import CartStepper from '../shared/CartStepper';
import { COLORS } from '../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../constants/font_sizes';
import { ICON_SIZES } from '../../constants/icon_sizes';
import { formatPrice } from '../../utils/menu';

const PLACEHOLDER_IMAGE = require('../../../assets/images/restaurant.jpg');

const CartScreen = () => {
  const { session, items, cartTotal, incrementProduct, decrementProduct } = useCart();

  useFocusEffect(
    useCallback(() => {
      if (items.length === 0) {
        router.replace('/');
      }
    }, [items]),
  );

  if (!session || items.length === 0) return null;

  const tableLabel = `Mesa ${session.tableCode}`;

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <AntDesign name='arrow-left' size={ICON_SIZES.medium} color={COLORS.primary.terracota} />
        </Pressable>
        <Text style={styles.headerTitle}>{tableLabel}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.itemsList}>
          {items.map((item) => {
            const imageSource = item.image ? { uri: item.image } : PLACEHOLDER_IMAGE;
            return (
              <View key={item.productId} style={styles.itemCard}>
                <Image source={imageSource} style={styles.itemImage} />
                <View style={styles.itemContent}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemUnitPrice}>
                    {formatPrice(item.price)} × {item.quantity}
                  </Text>
                </View>
                <CartStepper
                  quantity={item.quantity}
                  onIncrement={() => incrementProduct(item.productId)}
                  onDecrement={() => decrementProduct(item.productId)}
                />
                <Text style={styles.itemTotal}>{formatPrice(item.price * item.quantity)}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatPrice(cartTotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Servicio</Text>
            <Text style={styles.summaryValue}>Incluido</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(cartTotal)}</Text>
          </View>
        </View>
      </ScrollView>

      <Pressable style={styles.continueButton} onPress={() => router.push('/(checkout)/confirm')}>
        <Text style={styles.continueText}>Continuar →</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.common.gris_muy_claro,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.common.blanco,
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.common.gris_claro,
  },
  backButton: {
    width: ICON_SIZES.extra_large,
    height: ICON_SIZES.extra_large,
    borderRadius: BORDER_RADIUS.extra_large,
    backgroundColor: COLORS.common.gris_muy_claro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: FONT_SIZES.text_large,
    fontWeight: '700',
    color: COLORS.common.negro_principal,
  },
  headerSpacer: {
    width: ICON_SIZES.extra_large,
  },
  scrollContent: {
    padding: SPACING.medium,
    gap: SPACING.medium,
    paddingBottom: SPACING.extra_large,
  },
  itemsList: {
    gap: SPACING.small,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.small,
    padding: SPACING.medium,
    borderRadius: BORDER_RADIUS.medium,
    backgroundColor: COLORS.common.blanco,
    borderWidth: 1,
    borderColor: COLORS.common.gris_claro,
  },
  itemImage: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.small,
  },
  itemContent: {
    flex: 1,
    gap: SPACING.extra_small,
  },
  itemName: {
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
    color: COLORS.common.negro_principal,
  },
  itemUnitPrice: {
    fontSize: FONT_SIZES.text_small,
    color: COLORS.common.gris_oscuro,
  },
  itemTotal: {
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
    color: COLORS.primary.terracota,
  },
  summaryCard: {
    backgroundColor: COLORS.common.gris_claro,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.medium,
    gap: SPACING.small,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: FONT_SIZES.text_base,
    color: COLORS.common.gris_oscuro,
  },
  summaryValue: {
    fontSize: FONT_SIZES.text_base,
    color: COLORS.common.gris_oscuro,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.common.gris_medio,
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
  continueButton: {
    margin: SPACING.medium,
    paddingVertical: SPACING.medium,
    borderRadius: BORDER_RADIUS.medium,
    backgroundColor: COLORS.primary.terracota,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    color: COLORS.common.blanco,
    fontSize: FONT_SIZES.text_large,
    fontWeight: '700',
  },
});

export default CartScreen;
