import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Category, CreateProductPayload, Product } from '../../../types/types';
import { COLORS } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import { ICON_SIZES } from '../../../constants/icon_sizes';

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
  const [image, setImage] = useState('');
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

    setImage(product?.image ?? '');
    setName(product?.name ?? '');
    setDescription(product?.description ?? '');
    setPrice(product ? String(product.price) : '');
    setCategoryId(product?.category_id ?? categories[0]?.id ?? null);
  }, [categories, product, visible]);

  const previewUrl = useMemo(() => image.trim(), [image]);
  const isEditing = Boolean(product);

  const handleClose = () => {
    if (submitting) return;
    onClose();
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
        image: previewUrl || undefined,
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
    <Modal visible={visible} transparent animationType='slide' onRequestClose={handleClose}>
      <Pressable style={styles.overlay} onPress={handleClose}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardView}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.handle} />

            <View style={styles.header}>
              <Text style={styles.title}>{isEditing ? 'Editar producto' : 'Nuevo producto'}</Text>
              <Pressable style={styles.closeButton} onPress={handleClose} disabled={submitting}>
                <Ionicons name='close' size={ICON_SIZES.small} color={COLORS.common.gris_oscuro} />
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false}>
              <View style={styles.field}>
                <Text style={styles.label}>Imagen (URL)</Text>
                <TextInput
                  style={styles.input}
                  placeholder='https://example.com/producto.jpg'
                  placeholderTextColor={COLORS.common.gris_medio}
                  value={image}
                  onChangeText={setImage}
                  editable={!submitting}
                  autoCapitalize='none'
                />
              </View>

              <View style={styles.previewBox}>
                {previewUrl ? (
                  <Image source={{ uri: previewUrl }} style={styles.previewImage} resizeMode='cover' />
                ) : (
                  <>
                    <Ionicons name='image-outline' size={ICON_SIZES.large} color={COLORS.surface.borde_calido} />
                    <Text style={styles.previewText}>Vista previa</Text>
                  </>
                )}
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Nombre *</Text>
                <TextInput
                  style={styles.input}
                  placeholder='Ej: Burger de res'
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
                  placeholder='Descripción breve del plato'
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
                <Text style={styles.label}>Categoría *</Text>
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
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Precio (ARS) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder='1500'
                  placeholderTextColor={COLORS.common.gris_medio}
                  value={price}
                  onChangeText={setPrice}
                  editable={!submitting}
                  keyboardType='decimal-pad'
                />
              </View>

              <Pressable style={styles.submitButton} onPress={handleSubmit} disabled={submitting}>
                {submitting ? (
                  <ActivityIndicator color={COLORS.common.blanco} />
                ) : (
                  <Text style={styles.submitButtonText}>{isEditing ? 'Guardar cambios' : 'Agregar producto'}</Text>
                )}
              </Pressable>
            </ScrollView>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  keyboardView: {
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.common.blanco,
    borderTopLeftRadius: BORDER_RADIUS.large,
    borderTopRightRadius: BORDER_RADIUS.large,
    paddingHorizontal: SPACING.large,
    paddingBottom: SPACING.extra_large,
    paddingTop: SPACING.small,
    maxHeight: '92%',
  },
  handle: {
    alignSelf: 'center',
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.surface.borde_calido,
    marginBottom: SPACING.medium,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.medium,
  },
  title: {
    fontSize: FONT_SIZES.title_base,
    fontWeight: '800',
    color: COLORS.common.negro_principal,
  },
  closeButton: {
    width: ICON_SIZES.large,
    height: ICON_SIZES.large,
    borderRadius: ICON_SIZES.large,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.surface.borde_calido,
    backgroundColor: COLORS.surface.fondo_crema,
  },
  form: {
    gap: SPACING.medium,
    paddingBottom: SPACING.small,
  },
  field: {
    gap: SPACING.small,
  },
  label: {
    color: COLORS.common.gris_oscuro,
    fontWeight: '700',
    fontSize: FONT_SIZES.text_base,
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
  previewBox: {
    minHeight: 140,
    borderRadius: BORDER_RADIUS.medium,
    backgroundColor: COLORS.surface.fondo_crema,
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
