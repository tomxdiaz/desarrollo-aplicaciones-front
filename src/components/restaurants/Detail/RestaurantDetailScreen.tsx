import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import { ICON_SIZES } from '../../../constants/icon_sizes';
import { restaurantService } from '../../../services/restaurant.service';
import { Restaurant } from '../../../types/types';

const CREAM_BACKGROUND = `${COLORS.primary.arena_calida}33`;

const RestaurantDetailScreen = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [tableCode, setTableCode] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await restaurantService.getRestaurantById(id);
        setRestaurant(data);
      } catch (error) {
        console.error('Error fetching restaurant:', error);
        setRestaurant(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size='large' color={COLORS.primary.terracota} />
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>El restaurante no existe</Text>
        <Pressable style={styles.backLink} onPress={() => router.back()}>
          <Text style={styles.backLinkText}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Image style={styles.heroImage} source={require('../../../../assets/images/restaurant.jpg')} resizeMode='cover' />

        <View style={styles.content}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>

          {restaurant.address ? (
            <View style={styles.badgesRow}>
              <View style={styles.badge}>
                <Ionicons name='location-outline' size={ICON_SIZES.small} color={COLORS.common.gris_oscuro} />
                <Text style={styles.badgeText}>{restaurant.address}</Text>
              </View>
            </View>
          ) : null}

          {restaurant.description ? (
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionLabel}>DESCRIPCIÓN</Text>
              <Text style={styles.descriptionText}>{restaurant.description}</Text>
            </View>
          ) : null}

          <View style={styles.divider} />

          <View style={styles.tableSection}>
            <Text style={styles.tableTitle}>¿Estás en mesa?</Text>
            <Text style={styles.tableHint}>Ingresá el código que figura en tu mesa (ej: A3, TERRAZA)</Text>

            <TextInput
              style={styles.tableInput}
              placeholder='CÓDIGO DE MESA (A1, B3...)'
              placeholderTextColor={COLORS.common.gris_medio}
              value={tableCode}
              onChangeText={setTableCode}
              autoCapitalize='characters'
            />

            <View style={styles.divider} />

            <Pressable style={styles.outlineButton} onPress={() => {}}>
              <MaterialCommunityIcons name='qrcode-scan' size={ICON_SIZES.small} color={COLORS.primary.caramelo} />
              <Text style={styles.outlineButtonText}>Escanear QR de la mesa</Text>
            </Pressable>

            <Pressable style={styles.outlineButton} onPress={() => {}}>
              <Text style={styles.outlineButtonText}>Explorar menú sin mesa</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: CREAM_BACKGROUND,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CREAM_BACKGROUND,
    padding: SPACING.large,
    gap: SPACING.medium,
  },
  errorText: {
    fontSize: FONT_SIZES.text_large,
    color: COLORS.common.gris_oscuro,
    textAlign: 'center',
  },
  backLink: {
    paddingVertical: SPACING.small,
    paddingHorizontal: SPACING.medium,
  },
  backLinkText: {
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
    color: COLORS.primary.terracota,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.extra_large,
  },
  heroImage: {
    width: '100%',
    height: 220,
  },
  content: {
    backgroundColor: CREAM_BACKGROUND,
    paddingHorizontal: SPACING.large,
    paddingTop: SPACING.large,
    gap: SPACING.medium,
  },
  restaurantName: {
    fontSize: FONT_SIZES.title_base,
    fontWeight: '800',
    color: COLORS.common.negro_principal,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.small,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.extra_small,
    backgroundColor: COLORS.common.blanco,
    borderWidth: 1,
    borderColor: COLORS.common.gris_claro,
    borderRadius: BORDER_RADIUS.extra_large,
    paddingVertical: SPACING.small,
    paddingHorizontal: SPACING.medium,
  },
  badgeText: {
    fontSize: FONT_SIZES.text_small,
    color: COLORS.common.gris_oscuro,
    fontWeight: '600',
  },
  descriptionSection: {
    gap: SPACING.small,
  },
  sectionLabel: {
    fontSize: FONT_SIZES.text_small,
    fontWeight: '700',
    letterSpacing: 1,
    color: COLORS.primary.caramelo,
  },
  descriptionText: {
    fontSize: FONT_SIZES.text_base,
    lineHeight: 24,
    color: COLORS.common.gris_oscuro,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.common.gris_claro,
    marginVertical: SPACING.small,
  },
  tableSection: {
    gap: SPACING.medium,
  },
  tableTitle: {
    fontSize: FONT_SIZES.title_small,
    fontWeight: '800',
    color: COLORS.common.negro_principal,
  },
  tableHint: {
    fontSize: FONT_SIZES.text_small,
    color: COLORS.primary.caramelo,
    lineHeight: 20,
  },
  tableInput: {
    backgroundColor: COLORS.common.blanco,
    borderWidth: 1,
    borderColor: COLORS.common.gris_claro,
    borderRadius: BORDER_RADIUS.extra_large,
    paddingVertical: SPACING.medium,
    paddingHorizontal: SPACING.large,
    fontSize: FONT_SIZES.text_base,
    color: COLORS.common.negro_principal,
    textAlign: 'center',
  },
  outlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.small,
    backgroundColor: `${COLORS.primary.arena_calida}66`,
    borderWidth: 1,
    borderColor: COLORS.primary.caramelo,
    borderRadius: BORDER_RADIUS.extra_large,
    paddingVertical: SPACING.medium,
    paddingHorizontal: SPACING.large,
  },
  outlineButtonText: {
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
    color: COLORS.primary.caramelo,
  },
});

export default RestaurantDetailScreen;
