import { StyleSheet, View, Text, TextInput, Pressable, Alert } from 'react-native';
import { Restaurant } from '../../types/types';
import { BORDER_RADIUS, SPACING } from '../../constants/spacing_and_borders';
import RestaurantCard from './RestaurantCard';
import { FONT_SIZES } from '../../constants/font_sizes';
import { COLORS } from '../../constants/colors';
import { ICON_SIZES } from '../../constants/icon_sizes';
import { useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { goToScannedTable } from '../../utils/qr';

const RestaurantsList = ({ restaurants }: { restaurants: Restaurant[] }) => {
  const [searchText, setSearchText] = useState('');
  const filteredRestaurants = restaurants.filter((restaurant) => restaurant.name.toLowerCase().includes(searchText.toLowerCase()));

  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

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
            goToScannedTable(data);
          }}
        />

        <Pressable style={styles.cancelButton} onPress={() => setScanning(false)}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps='handled'
      enableOnAndroid
      extraScrollHeight={80}
      showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Restaurantes</Text>

      <TextInput style={styles.input} placeholder='Buscar restaurantes...' placeholderTextColor='#888888' value={searchText} onChangeText={setSearchText} />

      <Pressable style={styles.scanButton} onPress={openScanner}>
        <MaterialCommunityIcons name='qrcode-scan' size={ICON_SIZES.small} color={COLORS.primary.caramelo} />
        <Text style={styles.scanButtonText}>Escanear QR de la mesa</Text>
      </Pressable>

      <View style={styles.list}>
        {filteredRestaurants && filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant) => <RestaurantCard key={restaurant.id} restaurant={restaurant} />)
        ) : (
          <Text style={styles.unavailableText}>{'No hay restaurantes disponibles :('}</Text>
        )}
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    width: '100%',
  },
  container: {
    flexGrow: 1,
    flexDirection: 'column',
    padding: SPACING.large,
    gap: SPACING.large,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.common.gris_claro,
    borderRadius: BORDER_RADIUS.small,
    padding: SPACING.medium,
    fontSize: FONT_SIZES.text_large,
  },
  scanButton: {
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
  scanButtonText: {
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
    color: COLORS.primary.caramelo,
  },
  title: {
    fontSize: FONT_SIZES.title_base,
    fontWeight: '800',
    color: COLORS.primary.terracota,
  },
  list: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: SPACING.medium,
  },
  unavailableText: {
    fontSize: FONT_SIZES.text_large,
    color: COLORS.common.gris_oscuro,
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
    textAlign: 'center',
  },
});

export default RestaurantsList;
