import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useCart } from '../../providers/cart.provider';
import { orderService } from '../../services/order.service';
import { ApiError } from '../../lib/apiClient';
import { COLORS } from '../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../constants/font_sizes';
import { ICON_SIZES } from '../../constants/icon_sizes';
import { formatPrice } from '../../utils/menu';
import type { PaymentMethod } from '../../types/order.types';

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: 'CASH', label: 'Efectivo' },
  { value: 'CARD', label: 'Tarjeta' },
  { value: 'WALLET', label: 'Billetera virtual' },
];

const ConfirmOrderScreen = () => {
  const { session, items, cartTotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!session?.tableCode) {
    router.replace('/');
    return null;
  }

  const handleConfirm = async () => {
    if (loading) return;
    setLoading(true);
    setErrorMessage(null);

    try {
      await orderService.createOrder(session.restaurantId, {
        table_code: session.tableCode!,
        items: items.map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
        })),
        payment_method: paymentMethod,
      });
      clearCart();
      router.replace('/(checkout)/success');
    } catch (error) {
      console.error('Error creating order:', error);
      const message =
        error instanceof ApiError ? error.message : 'No se pudo enviar el pedido. Intentá de nuevo.';
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <AntDesign name='arrow-left' size={ICON_SIZES.medium} color={COLORS.primary.terracota} />
        </Pressable>
        <Text style={styles.headerTitle}>Confirmá tu pedido</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.tableCard}>
          <View style={styles.tableIconContainer}>
            <MaterialIcons name='restaurant' size={ICON_SIZES.medium} color={COLORS.common.gris_oscuro} />
          </View>
          <View>
            <Text style={styles.tableName}>Mesa {session.tableCode}</Text>
            <Text style={styles.tableCode}>Código: {session.tableCode}</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>RESUMEN</Text>
        <View style={styles.summaryCard}>
          {items.map((item) => (
            <View key={item.productId} style={styles.summaryRow}>
              <Text style={styles.summaryItemLabel}>
                {item.quantity}× {item.name}
              </Text>
              <Text style={styles.summaryItemValue}>{formatPrice(item.price * item.quantity)}</Text>
            </View>
          ))}
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(cartTotal)}</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>MÉTODO DE PAGO</Text>
        <View style={styles.paymentList}>
          {PAYMENT_OPTIONS.map((option) => {
            const isSelected = paymentMethod === option.value;
            return (
              <Pressable
                key={option.value}
                style={[styles.paymentOption, isSelected && styles.paymentOptionSelected]}
                onPress={() => setPaymentMethod(option.value)}>
                <Text style={[styles.paymentLabel, isSelected && styles.paymentLabelSelected]}>{option.label}</Text>
                {isSelected ? <AntDesign name='check-circle' size={ICON_SIZES.small} color={COLORS.primary.terracota} /> : null}
              </Pressable>
            );
          })}
        </View>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={[styles.confirmButton, loading && styles.confirmButtonDisabled]} onPress={handleConfirm} disabled={loading}>
          {loading ? <ActivityIndicator color={COLORS.common.blanco} /> : <Text style={styles.confirmText}>Confirmar Pedido</Text>}
        </Pressable>
      </View>
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
  tableCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.medium,
    backgroundColor: COLORS.common.gris_muy_claro,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1,
    borderColor: COLORS.common.gris_claro,
    padding: SPACING.medium,
  },
  tableIconContainer: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.extra_large,
    backgroundColor: COLORS.common.gris_claro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableName: {
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
    color: COLORS.common.negro_principal,
  },
  tableCode: {
    fontSize: FONT_SIZES.text_small,
    color: COLORS.common.gris_oscuro,
  },
  sectionLabel: {
    fontSize: FONT_SIZES.text_small,
    fontWeight: '700',
    color: COLORS.common.gris_oscuro,
    letterSpacing: 0.8,
  },
  summaryCard: {
    backgroundColor: COLORS.common.gris_muy_claro,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1,
    borderColor: COLORS.primary.terracota,
    overflow: 'hidden',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.small,
  },
  summaryItemLabel: {
    fontSize: FONT_SIZES.text_base,
    color: COLORS.common.negro_principal,
  },
  summaryItemValue: {
    fontSize: FONT_SIZES.text_base,
    color: COLORS.common.negro_principal,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: COLORS.primary.terracota,
  },
  totalLabel: {
    fontSize: FONT_SIZES.text_base,
    fontWeight: '800',
    color: COLORS.common.negro_principal,
  },
  totalValue: {
    fontSize: FONT_SIZES.text_base,
    fontWeight: '800',
    color: COLORS.primary.terracota,
  },
  paymentList: {
    gap: SPACING.small,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.common.blanco,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1,
    borderColor: COLORS.common.gris_claro,
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.medium,
  },
  paymentOptionSelected: {
    borderColor: COLORS.primary.terracota,
    backgroundColor: '#FDF3EF',
  },
  paymentLabel: {
    fontSize: FONT_SIZES.text_base,
    fontWeight: '600',
    color: COLORS.common.negro_principal,
  },
  paymentLabelSelected: {
    color: COLORS.primary.terracota,
  },
  errorText: {
    color: COLORS.status.error,
    fontSize: FONT_SIZES.text_small,
    textAlign: 'center',
  },
  footer: {
    padding: SPACING.medium,
    backgroundColor: COLORS.common.blanco,
    borderTopWidth: 1,
    borderTopColor: COLORS.common.gris_claro,
  },
  confirmButton: {
    height: 56,
    borderRadius: BORDER_RADIUS.medium,
    backgroundColor: COLORS.primary.terracota,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  confirmText: {
    color: COLORS.common.blanco,
    fontSize: FONT_SIZES.text_large,
    fontWeight: '700',
  },
});

export default ConfirmOrderScreen;
