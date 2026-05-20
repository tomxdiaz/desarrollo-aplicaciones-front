import React from 'react';
import { View, Text, StyleSheet, Pressable, Modal, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../providers/auth.provider';
import { AntDesign, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { BORDER_RADIUS, SPACING } from '../../constants/spacing_and_borders';
import { COLORS } from '../../constants/colors';
import { FONT_SIZES } from '../../constants/font_sizes';
import { ICON_SIZES } from '../../constants/icon_sizes';

type DrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function Drawer({ isOpen, onClose }: DrawerProps) {
  const { appUser, loading, signOut } = useAuth();

  const goTo = (path: string) => {
    onClose();
    router.navigate(path);
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  return (
    <Modal visible={isOpen} transparent animationType='fade' onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.drawer}>
          <View style={styles.header}>
            <Text style={styles.logo}>Provecho!</Text>

            <Pressable onPress={onClose} style={styles.closeButton}>
              <AntDesign name='close' size={ICON_SIZES.small} color={COLORS.primary.terracota} />
            </Pressable>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.profileSection}>
              <View style={styles.profileRow}>
                <View style={styles.avatar}>
                  <MaterialIcons name='person' size={ICON_SIZES.large} color={COLORS.primary.terracota} />
                </View>

                <View style={styles.profileText}>
                  <Text style={styles.email}>{loading ? 'Cargando...' : appUser?.email}</Text>
                  <Text style={styles.role}>{appUser?.global_role}</Text>
                </View>
              </View>
            </View>

            <View style={styles.nav}>
              <Pressable style={styles.navItem} onPress={() => goTo('/restaurants')}>
                <Ionicons name='restaurant-outline' size={ICON_SIZES.medium} color={COLORS.primary.terracota} />
                <Text style={styles.navText}>Restaurantes</Text>
              </Pressable>
              <Pressable style={styles.navItem} onPress={() => goTo('/my-orders')}>
                <MaterialCommunityIcons name='newspaper-variant-outline' size={ICON_SIZES.medium} color={COLORS.primary.terracota} />
                <Text style={styles.navText}>Mis Pedidos</Text>
              </Pressable>
              <Pressable style={styles.navItem} onPress={() => goTo('/my-restaurants')}>
                <Ionicons name='storefront-outline' size={ICON_SIZES.medium} color={COLORS.primary.terracota} />
                <Text style={styles.navText}>Mis Restaurantes</Text>
              </Pressable>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable style={styles.footerButton} onPress={handleSignOut}>
              <MaterialIcons name='logout' size={ICON_SIZES.medium} color={COLORS.primary.terracota} />
              <Text style={styles.footerButtonText}>Cerrar sesión</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },

  drawer: {
    width: 288,
    maxWidth: '85%',
    height: '100%',
    backgroundColor: COLORS.common.blanco,
    shadowColor: COLORS.common.negro_principal,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
  },

  header: {
    height: 64,
    paddingHorizontal: SPACING.large,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.common.gris_claro,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  logo: {
    fontSize: FONT_SIZES.text_large,
    fontWeight: '800',
    color: COLORS.common.negro_principal,
    fontFamily: 'Montserrat',
  },

  closeButton: {
    padding: SPACING.small,
    borderRadius: BORDER_RADIUS.medium,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${COLORS.primary.terracota}22`,
  },

  content: {
    flex: 1,
  },

  profileSection: {
    paddingHorizontal: SPACING.large,
    paddingVertical: SPACING.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.common.gris_claro,
  },

  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.large,
    backgroundColor: COLORS.common.gris_muy_claro,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.medium,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: `${COLORS.primary.terracota}44`,
  },

  avatarImage: {
    width: 48,
    height: 48,
    resizeMode: 'cover',
  },

  profileText: {
    flex: 1,
    display: 'flex',
    gap: SPACING.extra_small,
  },

  email: {
    marginTop: SPACING.extra_small,
    fontSize: FONT_SIZES.text_base,
    color: COLORS.common.gris_oscuro,
    fontWeight: '500',
  },

  role: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.small,
    paddingVertical: SPACING.extra_small,
    fontSize: FONT_SIZES.text_small,
    color: COLORS.common.gris_oscuro,
    backgroundColor: `${COLORS.common.gris_medio}22`,
    fontWeight: '500',
    borderRadius: BORDER_RADIUS.large,
  },

  nav: {
    paddingVertical: SPACING.small,
  },

  navItem: {
    minHeight: 52,
    paddingHorizontal: SPACING.large,
    paddingVertical: SPACING.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.common.gris_muy_claro,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.medium,
  },

  navText: {
    fontSize: FONT_SIZES.text_base,
    fontWeight: '600',
    color: COLORS.common.gris_oscuro,
    fontFamily: 'Work Sans',
  },

  footer: {
    paddingHorizontal: SPACING.large,
    paddingVertical: SPACING.medium,
    borderTopWidth: 1,
    borderTopColor: `${COLORS.primary.terracota}44`,
  },

  footerButton: {
    height: 48,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1,
    borderColor: COLORS.primary.terracota,
    backgroundColor: COLORS.common.blanco,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  footerButtonText: {
    fontSize: FONT_SIZES.text_small,
    fontWeight: '700',
    color: COLORS.primary.terracota,
    fontFamily: 'Work Sans',
  },
});
