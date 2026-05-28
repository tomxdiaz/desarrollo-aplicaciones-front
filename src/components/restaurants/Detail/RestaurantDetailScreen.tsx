import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import { ICON_SIZES } from '../../../constants/icon_sizes';
import { restaurantService } from '../../../services/restaurant.service';
import { Restaurant } from '../../../types/types';
import { CameraView, useCameraPermissions } from 'expo-camera';

function parseTableCode(code: string) {
  const clean = code.trim();

  const parts = clean.split('/');

  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return null;
  }

  return {
    restaurantId: parts[0],
    tableCode: parts[1],
  };
}

const RestaurantDetailScreen = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [tableCode, setTableCode] = useState('');
  const [tableCodeFocused, setTableCodeFocused] = useState(false);

  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();

  const goToMenu = (rawCode: string) => {
    const parsed = parseTableCode(rawCode);

    if (!parsed) {
      Alert.alert('Invalid code', 'The table code should look like restaurantId/tableCode');
      return;
    }

    router.push({
      pathname: '/(header-2)/restaurants/[id]/menu',
      params: { id: parsed.restaurantId, table: parsed.tableCode },
    });
  };

  const openScanner = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();

      if (!result.granted) {
        Alert.alert('Camera permission is required to scan the QR code.');
        return;
      }
    }

    setScanned(false);
    setScanning(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const restaurant = await restaurantService.getRestaurantById(id);
        setRestaurant(restaurant);
      } catch (error) {
        console.error('Error fetching restaurant:', error);
        setRestaurant(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (scanning) {
    return (
      <View style={{ flex: 1 }}>
        <CameraView
          style={{ flex: 1 }}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={({ data }) => {
            if (scanned) return;

            setScanned(true);
            setScanning(false);
            goToMenu(data);
          }}
        />

        <Pressable style={styles.cancelButton} onPress={() => setScanning(false)}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </Pressable>
      </View>
    );
  }

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
              placeholder={tableCodeFocused ? undefined : 'CÓDIGO DE MESA (A1, B3...)'}
              placeholderTextColor={COLORS.common.gris_medio}
              value={tableCode}
              onChangeText={setTableCode}
              onFocus={() => setTableCodeFocused(true)}
              onBlur={() => setTableCodeFocused(false)}
              autoCapitalize='characters'
              keyboardType='email-address'
            />

            {tableCode.trim().length > 0 ? (
              <Pressable
                style={styles.menuButton}
                onPress={() =>
                  router.push({
                    pathname: '/(header-2)/restaurants/[id]/menu',
                    params: { id, table: tableCode.trim() },
                  })
                }>
                <Text style={styles.menuButtonText}>Ir al menú</Text>
              </Pressable>
            ) : null}

            <View style={styles.divider} />

            <Pressable style={styles.outlineButton} onPress={openScanner}>
              <MaterialCommunityIcons name='qrcode-scan' size={ICON_SIZES.small} color={COLORS.primary.caramelo} />
              <Text style={styles.outlineButtonText}>Escanear QR de la mesa</Text>
            </Pressable>

            <Pressable
              style={styles.outlineButton}
              onPress={() =>
                router.push({
                  pathname: '/(header-2)/restaurants/[id]/menu',
                  params: { id },
                })
              }>
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
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  menuButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary.terracota,
    borderRadius: BORDER_RADIUS.extra_large,
    paddingVertical: SPACING.medium,
    paddingHorizontal: SPACING.large,
  },
  menuButtonText: {
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
    color: COLORS.common.blanco,
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
  cancelButton: {
    padding: SPACING.medium,
    backgroundColor: COLORS.common.gris_claro,
    borderRadius: BORDER_RADIUS.extra_large,
  },
  cancelButtonText: {
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
    color: COLORS.common.gris_oscuro,
  },
});

export default RestaurantDetailScreen;
