import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import { ICON_SIZES } from '../../../constants/icon_sizes';
import { restaurantService } from '../../../services/restaurant.service';
import { Restaurant } from '../../../types/types';
import { useHeaderRestaurant } from '../../../providers/header-restaurant.provider';
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
  const [tableInput, setTableInput] = useState('');
  const [tableInputFocused, setTableInputFocused] = useState(false);
  const [tableError, setTableError] = useState<string | null>(null);

  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();
  const { setRestaurantName } = useHeaderRestaurant();

  const TABLE_CODE_REGEX = /^[A-Za-z0-9 _\-]+$/;

  const goToMenu = (rawCode: string) => {
    const parsed = parseTableCode(rawCode);

    if (!parsed) {
      Alert.alert('Código inválido', 'El formato del QR no es válido.');
      return;
    }

    const tableExists = restaurant?.tables?.some(
      (t) => t.code.toUpperCase() === parsed.tableCode.toUpperCase(),
    );

    if (!tableExists) {
      Alert.alert('Mesa no encontrada', 'Esa mesa no existe en este restaurante.');
      return;
    }

    router.push({
      pathname: '/restaurants/[id]/menu',
      params: { id: parsed.restaurantId, table: parsed.tableCode },
    });
  };

  const handleGoToMenuManual = () => {
    const code = tableInput.trim();

    if (!TABLE_CODE_REGEX.test(code)) {
      setTableError('Código inválido. Usá solo letras y números (ej: 1A, TERRAZA).');
      return;
    }

    const tableExists = restaurant?.tables?.some(
      (t) => t.code.toUpperCase() === code.toUpperCase(),
    );

    if (!tableExists) {
      setTableError('Esa mesa no existe en este restaurante.');
      return;
    }

    setTableError(null);
    router.push({
      pathname: '/restaurants/[id]/menu',
      params: { id, table: code },
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

  // Publish the restaurant name to Header-1 while this screen is mounted.
  useEffect(() => {
    setRestaurantName(restaurant?.name ?? null);
    return () => setRestaurantName(null);
  }, [restaurant?.name, setRestaurantName]);

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
      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps='handled'
        enableOnAndroid
        extraScrollHeight={80}
        showsVerticalScrollIndicator={false}>
        {restaurant.image ? (
          <Image style={styles.heroImage} source={{ uri: restaurant.image }} resizeMode='cover' />
        ) : (
          <View style={[styles.heroImage, styles.heroPlaceholder]}>
            <Ionicons name='restaurant' size={ICON_SIZES.extra_large} color={COLORS.common.blanco} />
          </View>
        )}

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
            <Text style={styles.tableHint}>Ingresá el código que figura en tu mesa (ej: 1A, TERRAZA)</Text>

            <TextInput
              style={[styles.tableInput, tableError ? styles.tableInputError : null]}
              placeholder={tableInputFocused ? undefined : 'CÓDIGO DE MESA (1A, 2B...)'}
              placeholderTextColor={COLORS.common.gris_medio}
              value={tableInput}
              onChangeText={(text) => { setTableInput(text); setTableError(null); }}
              onFocus={() => setTableInputFocused(true)}
              onBlur={() => setTableInputFocused(false)}
              autoCapitalize='characters'
              keyboardType='email-address'
            />

            {tableError ? (
              <Text style={styles.tableErrorText}>{tableError}</Text>
            ) : null}

            {tableInput.trim().length > 0 ? (
              <Pressable style={styles.menuButton} onPress={handleGoToMenuManual}>
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
                  pathname: '/restaurants/[id]/menu',
                  params: { id },
                })
              }>
              <Text style={styles.outlineButtonText}>Explorar menú sin mesa</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAwareScrollView>
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
  heroPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary.arena_calida,
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
  tableInputError: {
    borderColor: COLORS.status.error,
  },
  tableErrorText: {
    fontSize: FONT_SIZES.text_small,
    color: COLORS.status.error,
    textAlign: 'center',
    fontWeight: '600',
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
