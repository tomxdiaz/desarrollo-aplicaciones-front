import { Image, Pressable, StyleSheet, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../constants/font_sizes';
import { ICON_SIZES } from '../../constants/icon_sizes';

type ImagePickerFieldProps = {
  /** URI of the currently selected image. Empty string means no image selected. */
  previewUrl: string;
  onPick: () => void;
  disabled?: boolean;
  /**
   * Background color of the preview box. Default: blanco.
   * MenuProductFormModal uses fondo_crema (sheet bg is blanco, needs contrast).
   */
  previewBoxBackground?: string;
  /**
   * Background color of the image picker button. Default: blanco.
   * MenuProductFormModal uses fondo_crema for visual consistency with its sheet.
   */
  imageButtonBackground?: string;
};

const ImagePickerField = ({
  previewUrl,
  onPick,
  disabled,
  previewBoxBackground = COLORS.common.blanco,
  imageButtonBackground = COLORS.common.blanco,
}: ImagePickerFieldProps) => {
  return (
    <>
      <Pressable style={[styles.previewBox, { backgroundColor: previewBoxBackground }]} onPress={onPick} disabled={disabled}>
        {previewUrl ? (
          <Image source={{ uri: previewUrl }} style={styles.previewImage} resizeMode='cover' />
        ) : (
          <>
            <Ionicons name='image-outline' size={ICON_SIZES.large} color={COLORS.surface.borde_calido} />
            <Text style={styles.previewText}>Vista previa</Text>
          </>
        )}
      </Pressable>
      <Pressable style={[styles.imageButton, { backgroundColor: imageButtonBackground }]} onPress={onPick} disabled={disabled}>
        <Ionicons name='image-outline' size={ICON_SIZES.small} color={COLORS.primary.terracota} />
        <Text style={styles.imageButtonText}>{previewUrl ? 'Cambiar imagen' : 'Seleccionar imagen'}</Text>
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  previewBox: {
    minHeight: 140,
    borderRadius: BORDER_RADIUS.medium,
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
  },
  imageButtonText: {
    color: COLORS.primary.terracota,
    fontWeight: '700',
    fontSize: FONT_SIZES.text_base,
  },
});

export default ImagePickerField;
