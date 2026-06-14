import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ImageFile, Restaurant } from '../../../types/types';
import { restaurantService } from '../../../services/restaurant.service';
import { pickImage } from '../../../utils/image';
import { COLORS } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import { ICON_SIZES } from '../../../constants/icon_sizes';

const RestaurantEditScreen = ({
  restaurantId,
  restaurant,
  onRefresh,
}: {
  restaurantId: string;
  restaurant: Restaurant;
  onRefresh: () => Promise<void>;
}) => {
  const [name, setName] = useState(restaurant.name);
  const [description, setDescription] = useState(restaurant.description ?? '');
  const [address, setAddress] = useState(restaurant.address ?? '');
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(restaurant.image ?? null);
  const [submitting, setSubmitting] = useState(false);

  // Sync form when parent refreshes restaurant data after a successful save.
  useEffect(() => {
    setName(restaurant.name);
    setDescription(restaurant.description ?? '');
    setAddress(restaurant.address ?? '');
    setImageFile(null);
    setExistingImage(restaurant.image ?? null);
  }, [restaurant]);

  const previewUrl = useMemo(() => imageFile?.uri ?? existingImage ?? '', [imageFile, existingImage]);

  const handlePickImage = async () => {
    if (submitting) return;
    const picked = await pickImage();
    if (picked) setImageFile(picked);
  };

  const handleSave = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      Alert.alert('Falta el nombre', 'El nombre del restaurante es requerido.');
      return;
    }

    setSubmitting(true);

    try {
      await restaurantService.updateRestaurant(restaurantId, {
        name: trimmedName,
        description: description.trim() || null,
        address: address.trim() || null,
        imageFile: imageFile ?? undefined,
      });
      await onRefresh();
      Alert.alert('Guardado', 'La información del restaurante fue actualizada.');
    } catch (error) {
      console.error('Error updating restaurant:', error);
      Alert.alert('Error', 'No se pudo actualizar el restaurante. Intentá de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps='handled'
      enableOnAndroid
      extraScrollHeight={80}
      showsVerticalScrollIndicator={false}
    >
        <View style={styles.field}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            placeholder='Nombre del restaurante'
            placeholderTextColor={COLORS.common.gris_medio}
            value={name}
            onChangeText={setName}
            editable={!submitting}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder='Descripción del restaurante'
            placeholderTextColor={COLORS.common.gris_medio}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical='top'
            editable={!submitting}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Ubicación</Text>
          <TextInput
            style={styles.input}
            placeholder='Barrio, Ciudad'
            placeholderTextColor={COLORS.common.gris_medio}
            value={address}
            onChangeText={setAddress}
            editable={!submitting}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Imagen</Text>
          <Pressable style={styles.previewBox} onPress={handlePickImage} disabled={submitting}>
            {previewUrl ? (
              <Image source={{ uri: previewUrl }} style={styles.previewImage} resizeMode='cover' />
            ) : (
              <>
                <Ionicons name='image-outline' size={ICON_SIZES.large} color={COLORS.surface.borde_calido} />
                <Text style={styles.previewText}>Vista previa</Text>
              </>
            )}
          </Pressable>
          <Pressable style={styles.imageButton} onPress={handlePickImage} disabled={submitting}>
            <Ionicons name='image-outline' size={ICON_SIZES.small} color={COLORS.primary.terracota} />
            <Text style={styles.imageButtonText}>{previewUrl ? 'Cambiar imagen' : 'Seleccionar imagen'}</Text>
          </Pressable>
        </View>

        <Pressable
          style={[styles.saveButton, submitting && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={submitting}
          accessibilityRole='button'
          accessibilityLabel='Guardar cambios'
        >
          {submitting ? (
            <ActivityIndicator color={COLORS.common.blanco} />
          ) : (
            <Text style={styles.saveButtonText}>Guardar cambios</Text>
          )}
        </Pressable>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    gap: SPACING.medium,
    padding: SPACING.large,
    paddingBottom: SPACING.extra_large,
  },
  field: {
    gap: SPACING.small,
  },
  label: {
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
    color: COLORS.common.gris_oscuro,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.surface.borde_calido,
    borderRadius: BORDER_RADIUS.medium,
    backgroundColor: COLORS.common.blanco,
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.medium,
    fontSize: FONT_SIZES.text_base,
    color: COLORS.common.negro_principal,
  },
  textArea: {
    minHeight: 100,
    paddingTop: SPACING.medium,
  },
  previewBox: {
    minHeight: 140,
    borderRadius: BORDER_RADIUS.medium,
    backgroundColor: COLORS.common.blanco,
    borderWidth: 1,
    borderColor: COLORS.surface.borde_calido,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    gap: SPACING.small,
  },
  previewImage: {
    width: '100%',
    height: 180,
  },
  previewText: {
    color: COLORS.common.gris_medio,
    fontSize: FONT_SIZES.text_base,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.small,
    paddingVertical: SPACING.medium,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1,
    borderColor: COLORS.primary.terracota,
    backgroundColor: COLORS.common.blanco,
  },
  imageButtonText: {
    color: COLORS.primary.terracota,
    fontWeight: '700',
    fontSize: FONT_SIZES.text_base,
  },
  saveButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.medium,
    borderRadius: BORDER_RADIUS.extra_large,
    backgroundColor: COLORS.primary.terracota,
    marginTop: SPACING.small,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: COLORS.common.blanco,
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
  },
});

export default RestaurantEditScreen;
