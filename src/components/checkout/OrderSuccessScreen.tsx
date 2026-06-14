import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useCart } from '../../providers/cart.provider';
import { COLORS } from '../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../constants/font_sizes';
import { ICON_SIZES } from '../../constants/icon_sizes';

const OrderSuccessScreen = () => {
  const { session } = useCart();

  const time = useMemo(() => {
    return new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  }, []);

  const tableLabel = session?.tableCode ? `Mesa ${session.tableCode}` : 'Tu mesa';

  return (
    <View style={styles.screen}>
      <View style={styles.iconContainer}>
        <AntDesign name='check-circle' size={ICON_SIZES.large} color={COLORS.secondary.verde_oliva} />
      </View>

      <Text style={styles.title}>¡Pedido enviado!</Text>
      <Text style={styles.subtitle}>El personal ya recibió tu orden.</Text>
      <Text style={styles.meta}>
        {tableLabel} · {time}
      </Text>

      <View style={styles.actions}>
        <Pressable style={styles.primaryButton} onPress={() => router.replace('/')}>
          <Text style={styles.primaryButtonText}>Volver al inicio</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => router.replace('/my-orders')}>
          <Text style={styles.secondaryButtonText}>Ver mis pedidos</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.common.gris_muy_claro,
    paddingHorizontal: SPACING.large,
    gap: SPACING.small,
  },
  iconContainer: {
    width: 88,
    height: 88,
    borderRadius: BORDER_RADIUS.extra_large,
    backgroundColor: COLORS.common.gris_claro,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.medium,
  },
  title: {
    fontSize: FONT_SIZES.title_base,
    fontWeight: '800',
    color: COLORS.common.negro_principal,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZES.text_base,
    color: COLORS.common.gris_oscuro,
    textAlign: 'center',
  },
  meta: {
    fontSize: FONT_SIZES.text_small,
    color: COLORS.common.gris_medio,
    textAlign: 'center',
    marginBottom: SPACING.large,
  },
  actions: {
    width: '100%',
    gap: SPACING.medium,
    marginTop: SPACING.medium,
  },
  primaryButton: {
    height: 56,
    borderRadius: BORDER_RADIUS.medium,
    backgroundColor: COLORS.primary.terracota,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: COLORS.common.blanco,
    fontSize: FONT_SIZES.text_large,
    fontWeight: '700',
  },
  secondaryButton: {
    height: 56,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1,
    borderColor: COLORS.common.gris_claro,
    backgroundColor: COLORS.common.blanco,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: COLORS.common.gris_oscuro,
    fontSize: FONT_SIZES.text_large,
    fontWeight: '600',
  },
});

export default OrderSuccessScreen;
