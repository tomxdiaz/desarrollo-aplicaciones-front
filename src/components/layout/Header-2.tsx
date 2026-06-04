import { useState } from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../constants/font_sizes';
import { ICON_SIZES } from '../../constants/icon_sizes';
import { useCart } from '../../providers/cart.provider';
import { Drawer } from './Drawer';

export default function Header2() {
  const { session, cartCount, hasTable } = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const subtitle = session?.restaurantName ?? '';
  const tableLabel = session?.tableCode ? `Mesa ${session.tableCode}` : undefined;

  const handleToggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  const handleCartPress = () => {
    router.push('/(checkout)/cart');
  };

  return (
    <View style={styles.header}>
      <View style={styles.leftGroup}>
        <Pressable
          style={styles.iconButton}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            }
          }}>
          <AntDesign name='arrow-left' size={ICON_SIZES.medium} color={COLORS.primary.terracota} />
        </Pressable>
        <View style={styles.textGroup}>
          <Text style={styles.title}>Provecho!</Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
      <View style={styles.rightGroup}>
        {tableLabel ? (
          <View style={styles.tablePill}>
            <Text style={styles.tablePillText} numberOfLines={1}>
              {tableLabel}
            </Text>
          </View>
        ) : null}
        {hasTable ? (
          <TouchableOpacity style={styles.iconButton} onPress={handleCartPress} activeOpacity={0.8}>
            <AntDesign name='shopping-cart' size={ICON_SIZES.medium} color={COLORS.primary.terracota} />
            {cartCount > 0 ? (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount > 99 ? '99+' : cartCount}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity onPress={handleToggleDrawer} style={styles.iconButton}>
          <AntDesign name='menu' size={ICON_SIZES.medium} color={COLORS.primary.terracota} />
        </TouchableOpacity>
      </View>
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.common.blanco,
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.common.gris_claro,
  },
  leftGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.small,
    marginRight: SPACING.small,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.small,
  },
  iconButton: {
    width: ICON_SIZES.extra_large,
    height: ICON_SIZES.extra_large,
    borderRadius: BORDER_RADIUS.extra_large,
    backgroundColor: COLORS.common.gris_muy_claro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textGroup: {
    flexShrink: 1,
    gap: SPACING.extra_small,
  },
  title: {
    color: COLORS.primary.terracota,
    fontSize: FONT_SIZES.title_small,
    fontWeight: 'bold',
  },
  subtitle: {
    color: COLORS.primary.caramelo,
    fontSize: FONT_SIZES.text_small,
  },
  tablePill: {
    maxWidth: 100,
    paddingHorizontal: SPACING.small,
    paddingVertical: SPACING.extra_small,
    borderRadius: BORDER_RADIUS.extra_large,
    backgroundColor: COLORS.common.gris_muy_claro,
  },
  tablePillText: {
    color: COLORS.primary.terracota,
    fontSize: FONT_SIZES.text_small,
    fontWeight: '600',
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary.terracota,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: COLORS.common.blanco,
    fontSize: 10,
    fontWeight: '700',
  },
});
