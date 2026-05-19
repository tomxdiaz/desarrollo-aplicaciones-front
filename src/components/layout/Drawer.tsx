import React from 'react';
import { View, Text, StyleSheet, Pressable, Modal, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../providers/auth.provider';
import { AntDesign } from '@expo/vector-icons';
import { BORDER_RADIUS, SPACING } from '../../constants/spacing_and_borders';
import { COLORS } from '../../constants/colors';
import { FONT_SIZES } from '../../constants/font_sizes';
import { ICON_SIZES } from '../../constants/icon_sizes';

type DrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function Drawer({ isOpen, onClose }: DrawerProps) {
  const { session, appUser, loading, signOut } = useAuth();

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
              <AntDesign name='close' size={24} color='black' />
            </Pressable>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.profileSection}>
              <View style={styles.profileRow}>
                <View style={styles.avatar}>
                  {/* <Image source={require('../../assets/profile-placeholder.png')} style={styles.avatarImage} /> */}
                  <Text>example image</Text>
                </View>

                <View style={styles.profileText}>
                  {loading ? (
                    <>
                      <Text style={styles.userName}>Cargando...</Text>
                      <Text style={styles.userEmail}>Preparando tu perfil</Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.userName}>{appUser?.id ?? 'Usuario'}</Text>
                      <Text style={styles.userEmail}>{session?.user.email ?? 'Email'}</Text>
                    </>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.nav}>
              <DrawerItem label='Inicio' onPress={() => goTo('/')} />
              <DrawerItem label='Mis pedidos' onPress={() => goTo('/my-orders')} />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable style={styles.footerButton} onPress={handleSignOut}>
              <Text style={styles.footerButtonText}>Cerrar sesión</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

type DrawerItemProps = {
  label: string;
  onPress: () => void;
};

function DrawerItem({ label, onPress }: DrawerItemProps) {
  return (
    <Pressable style={styles.navItem} onPress={onPress}>
      <Text style={styles.navText}>{label}</Text>
    </Pressable>
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
    width: ICON_SIZES.large,
    height: ICON_SIZES.large,
    borderRadius: BORDER_RADIUS.medium,
    alignItems: 'center',
    justifyContent: 'center',
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
    borderColor: COLORS.common.gris_claro,
  },

  avatarImage: {
    width: 48,
    height: 48,
    resizeMode: 'cover',
  },

  profileText: {
    flex: 1,
  },

  userName: {
    fontSize: FONT_SIZES.text_small,
    fontWeight: '700',
    color: COLORS.common.negro_principal,
    fontFamily: 'Montserrat',
  },

  userEmail: {
    marginTop: SPACING.extra_small,
    fontSize: FONT_SIZES.text_small,
    color: COLORS.common.gris_oscuro,
    fontFamily: 'Work Sans',
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
    flexDirection: 'row',
    alignItems: 'center',
  },

  navText: {
    fontSize: FONT_SIZES.text_base,
    fontWeight: '600',
    color: COLORS.common.negro_principal,
    fontFamily: 'Work Sans',
  },

  footer: {
    paddingHorizontal: SPACING.large,
    paddingVertical: SPACING.medium,
    borderTopWidth: 1,
    borderTopColor: COLORS.common.gris_claro,
  },

  footerButton: {
    height: 48,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1,
    borderColor: COLORS.primary.terracota,
    backgroundColor: COLORS.common.blanco,
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
