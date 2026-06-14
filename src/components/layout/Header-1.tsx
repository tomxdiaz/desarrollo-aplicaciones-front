import * as SplashScreen from 'expo-splash-screen';
import { Image, StyleSheet, View, Text, TouchableOpacity, Pressable } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../constants/font_sizes';
import { useState } from 'react';
import { Drawer } from './Drawer';
import AntDesign from '@expo/vector-icons/AntDesign';
import { ICON_SIZES } from '../../constants/icon_sizes';
import { router } from 'expo-router';
import { useHeaderRestaurant } from '../../providers/header-restaurant.provider';

export default function Header1() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { restaurantName } = useHeaderRestaurant();

  const handleToggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  return (
    <View style={styles.header}>
      <View style={styles.leftGroup}>
        <Pressable
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            }
          }}>
          <AntDesign name='arrow-left' size={ICON_SIZES.medium} color={COLORS.common.blanco} />
        </Pressable>
        <View style={styles.logoTitleContainer}>
          <Image style={styles.logo} source={require('../../../assets/logos/logo_outlined.png')} />
          <View style={styles.titleGroup}>
            <Text style={styles.title}>Provecho!</Text>
            {restaurantName ? (
              <Text style={styles.subtitle} numberOfLines={1}>
                {restaurantName}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={handleToggleDrawer} style={styles.drawerButton}>
        <AntDesign name='menu' size={ICON_SIZES.medium} color={COLORS.common.blanco} />
      </TouchableOpacity>
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary.terracota,
    padding: SPACING.medium,
  },
  leftGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.small,
    marginRight: SPACING.small,
  },
  logoTitleContainer: {
    flexShrink: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.medium,
  },
  logo: {
    width: 80,
    height: 60,
    resizeMode: 'contain',
  },
  titleGroup: {
    flexShrink: 1,
  },
  title: {
    color: COLORS.common.blanco,
    fontSize: FONT_SIZES.title_small,
    fontWeight: 'bold',
  },
  subtitle: {
    color: COLORS.common.blanco,
    fontSize: FONT_SIZES.text_small,
    opacity: 0.9,
  },
  drawerButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.medium,
    borderRadius: SPACING.extra_large,
  },
});
