import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Category, CreateProductPayload, ImageFile, Product } from '../../../types/types';
import { pickImage } from '../../../utils/image';
import { COLORS } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import BottomSheetModal from '../../shared/BottomSheetModal';
import FormField from '../../shared/FormField';
import ImagePickerField from '../../shared/ImagePickerField';
import ModalHeader from '../../shared/ModalHeader';

const MenuProductFormModal = ({
  visible,
  categories,
  product,
  onClose,
  onSubmit,
}: {
  visible: boolean;
  categories: Category[];
  product: Product | null;
  onClose: () => void;
  onSubmit: (payload: CreateProductPayload) => Promise<void>;
}) => {
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!visible) {
      setSubmitting(false);
      return;
    }

    setImageFile(null);
    setExistingImage(product?.image ?? null);
    setName(product?.name ?? '');
    setDescription(product?.description ?? '');
    setPrice(product ? String(product.price) : '');
    setCategoryId(product?.category_id ?? categories[0]?.id ?? null);
  }, [categories, product, visible]);

  const previewUrl = useMemo(() => imageFile?.uri ?? existingImage ?? '', [imageFile, existingImage]);
  const isEditing = Boolean(product);

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  const handlePickImage = async () => {
    if (submitting) return;
    const picked = await pickImage();
    if (picked) setImageFile(picked);
  };

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    const parsedPrice = Number(price.replace(',', '.'));

    if (!trimmedName) {
      Alert.alert('Falta el nombre', 'Ingresá el nombre del producto.');
      return;
    }

    if (!categoryId) {
      Alert.alert('Falta la categoría', 'Seleccioná una categoría.');
      return;
    }

    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      Alert.alert('Precio inválido', 'Ingresá un precio válido mayor o igual a cero.');
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit({
        category_id: categoryId,
        name: trimmedName,
        description: description.trim() || undefined,
        price: parsedPrice,
        imageFile: imageFile ?? undefined,
      });
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      Alert.alert('Error', isEditing ? 'No se pudo actualizar el producto.' : 'No se pudo crear el producto.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BottomSheetModal
      visible={visible}
      onClose={handleClose}
      animationType='slide'
      maxHeight='92%'
      sheetStyle={styles.sheetOverride}>
      <View style={styles.handle} />

      <ModalHeader
        title={isEditing ? 'Editar producto' : 'Nuevo producto'}
        onClose={handleClose}
        disabled={submitting}
        style={styles.headerOverride}
        titleStyle={styles.titleOverride}
        closeButtonStyle={styles.closeButtonOverride}
      />

      <KeyboardAwareScrollView
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps='handled'
        extraScrollHeight={80}
        showsVerticalScrollIndicator={false}>
        <FormField label='Imagen'>
          <ImagePickerField
            previewUrl={previewUrl}
            onPick={handlePickImage}
            disabled={submitting}
            previewBoxBackground={COLORS.surface.fondo_crema}
            imageButtonBackground={COLORS.surface.fondo_crema}
          />
        </FormField>

        <FormField label='Nombre *' maxLength={40} value={name}>
          <TextInput
            style={styles.input}
            placeholder='Ej: Burger de res'
            placeholderTextColor={COLORS.common.gris_medio}
            value={name}
            onChangeText={setName}
            maxLength={40}
            editable={!submitting}
          />
        </FormField>

        <FormField label='Descripción' maxLength={200} value={description}>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder='Descripción breve del plato'
            placeholderTextColor={COLORS.common.gris_medio}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical='top'
            maxLength={200}
            editable={!submitting}
          />
        </FormField>

        <FormField label='Categoría *'>
          <View style={styles.categoryGrid}>
            {categories.map((category) => {
              const selected = category.id === categoryId;
              return (
                <Pressable
                  key={category.id}
                  style={[styles.categoryChip, selected && styles.categoryChipSelected]}
                  onPress={() => setCategoryId(category.id)}
                  disabled={submitting}>
                  <Text style={[styles.categoryChipText, selected && styles.categoryChipTextSelected]}>{category.name}</Text>
                </Pressable>
              );
            })}
          </View>
        </FormField>

        <FormField label='Precio (ARS) *'>
          <TextInput
            style={styles.input}
            placeholder='1500'
            placeholderTextColor={COLORS.common.gris_medio}
            value={price}
            onChangeText={setPrice}
            editable={!submitting}
            keyboardType='decimal-pad'
          />
        </FormField>

        <Pressable style={styles.submitButton} onPress={handleSubmit} disabled={submitting}>
          {submitting ? (
            <ActivityIndicator color={COLORS.common.blanco} />
          ) : (
            <Text style={styles.submitButtonText}>{isEditing ? 'Guardar cambios' : 'Agregar producto'}</Text>
          )}
        </Pressable>
      </KeyboardAwareScrollView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  sheetOverride: {
    backgroundColor: COLORS.common.blanco,
    padding: 0,
    gap: 0,
    paddingHorizontal: SPACING.large,
    paddingBottom: SPACING.extra_large,
    paddingTop: SPACING.small,
  },
  handle: {
    alignSelf: 'center',
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.surface.borde_calido,
    marginBottom: SPACING.medium,
  },
  headerOverride: {
    alignItems: 'center',
    gap: 0,
    marginBottom: SPACING.medium,
  },
  titleOverride: {
    fontSize: FONT_SIZES.title_base,
  },
  closeButtonOverride: {
    backgroundColor: COLORS.surface.fondo_crema,
  },
  form: {
    gap: SPACING.medium,
    paddingBottom: SPACING.extra_large,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.surface.borde_calido,
    borderRadius: BORDER_RADIUS.medium,
    backgroundColor: COLORS.surface.fondo_crema,
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.medium,
    fontSize: FONT_SIZES.text_base,
    color: COLORS.common.negro_principal,
  },
  textArea: {
    minHeight: 100,
    paddingTop: SPACING.medium,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.small,
  },
  categoryChip: {
    borderRadius: BORDER_RADIUS.extra_large,
    borderWidth: 1,
    borderColor: COLORS.surface.borde_calido,
    backgroundColor: COLORS.surface.fondo_crema,
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.small,
  },
  categoryChipSelected: {
    backgroundColor: COLORS.primary.terracota,
    borderColor: COLORS.primary.terracota,
  },
  categoryChipText: {
    color: COLORS.common.gris_oscuro,
    fontWeight: '600',
    fontSize: FONT_SIZES.text_small,
  },
  categoryChipTextSelected: {
    color: COLORS.common.blanco,
  },
  submitButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.medium,
    borderRadius: BORDER_RADIUS.extra_large,
    backgroundColor: COLORS.primary.terracota,
    marginTop: SPACING.small,
  },
  submitButtonText: {
    color: COLORS.common.blanco,
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
  },
});

export default MenuProductFormModal;
