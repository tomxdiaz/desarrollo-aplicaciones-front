import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ImageFile, Restaurant } from '../../../types/types';
import { restaurantService } from '../../../services/restaurant.service';
import { pickImage } from '../../../utils/image';
import { COLORS } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import { formInputStyle } from '../../../constants/sharedInputStyles';
import FormField from '../../shared/FormField';
import ImagePickerField from '../../shared/ImagePickerField';

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
      showsVerticalScrollIndicator={false}>
      <FormField label='Nombre'>
        <TextInput
          style={styles.input}
          placeholder='Nombre del restaurante'
          placeholderTextColor={COLORS.common.gris_medio}
          value={name}
          onChangeText={setName}
          editable={!submitting}
        />
      </FormField>

      <FormField label='Descripción'>
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
      </FormField>

      <FormField label='Ubicación'>
        <TextInput
          style={styles.input}
          placeholder='Barrio, Ciudad'
          placeholderTextColor={COLORS.common.gris_medio}
          value={address}
          onChangeText={setAddress}
          editable={!submitting}
        />
      </FormField>

      <FormField label='Imagen'>
        <ImagePickerField
          previewUrl={previewUrl}
          onPick={handlePickImage}
          disabled={submitting}
        />
      </FormField>

      <Pressable
        style={[styles.saveButton, submitting && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={submitting}
        accessibilityRole='button'
        accessibilityLabel='Guardar cambios'>
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
  input: formInputStyle,
  textArea: {
    minHeight: 100,
    paddingTop: SPACING.medium,
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
