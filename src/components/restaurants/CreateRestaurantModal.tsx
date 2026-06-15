import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { COLORS } from '../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../constants/font_sizes';
import { formInputStyle } from '../../constants/sharedInputStyles';
import { CreateRestaurantPayload, ImageFile } from '../../types/types';
import { pickImage } from '../../utils/image';
import BottomSheetModal from '../shared/BottomSheetModal';
import FormField from '../shared/FormField';
import ImagePickerField from '../shared/ImagePickerField';
import ModalHeader from '../shared/ModalHeader';

const CreateRestaurantModal = ({
  visible,
  onClose,
  onCreate,
}: {
  visible: boolean;
  onClose: () => void;
  onCreate: (payload: CreateRestaurantPayload) => Promise<void>;
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setName('');
    setDescription('');
    setAddress('');
    setImageFile(null);
  };

  const handleClose = () => {
    if (submitting) return;
    reset();
    onClose();
  };

  const handlePickImage = async () => {
    if (submitting) return;
    const picked = await pickImage();
    if (picked) setImageFile(picked);
  };

  const handleSubmit = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      Alert.alert('Falta el nombre', 'Ingresá el nombre del restaurante.');
      return;
    }

    setSubmitting(true);

    try {
      await onCreate({
        name: trimmedName,
        description: description.trim() || undefined,
        address: address.trim() || undefined,
        imageFile: imageFile ?? undefined,
      });
      reset();
      onClose();
    } catch (error) {
      console.error('Error creating restaurant:', error);
      Alert.alert('Error', 'No se pudo crear el restaurante. Intentá de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BottomSheetModal
      visible={visible}
      onClose={handleClose}
      animationType='slide'
      maxHeight='90%'
      sheetStyle={styles.sheetOverride}>
      <View style={styles.handle} />
      <ModalHeader
        title='Crear Restaurante'
        onClose={handleClose}
        disabled={submitting}
        style={styles.headerOverride}
      />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.form}
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

        <FormField label='Descripcion'>
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

        <FormField label='Ubicacion'>
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
            previewUrl={imageFile?.uri ?? ''}
            onPick={handlePickImage}
            disabled={submitting}
          />
        </FormField>

        <Pressable style={styles.createButton} onPress={handleSubmit} disabled={submitting}>
          {submitting ? (
            <ActivityIndicator color={COLORS.common.blanco} />
          ) : (
            <Text style={styles.createButtonText}>Crear Restaurante</Text>
          )}
        </Pressable>
      </KeyboardAwareScrollView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  sheetOverride: {
    padding: 0,
    gap: 0,
    paddingHorizontal: SPACING.large,
    paddingBottom: SPACING.extra_large,
    paddingTop: SPACING.small,
  },
  handle: {
    alignSelf: 'center',
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.surface.borde_calido,
    marginBottom: SPACING.medium,
  },
  headerOverride: {
    alignItems: 'center',
    gap: 0,
    marginBottom: SPACING.medium,
  },
  form: {
    gap: SPACING.medium,
    paddingBottom: SPACING.small,
  },
  input: formInputStyle,
  textArea: {
    minHeight: 100,
    paddingTop: SPACING.medium,
  },
  createButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.medium,
    borderRadius: BORDER_RADIUS.extra_large,
    backgroundColor: COLORS.primary.terracota,
    marginTop: SPACING.small,
  },
  createButtonText: {
    color: COLORS.common.blanco,
    fontSize: FONT_SIZES.text_base,
    fontWeight: '700',
  },
});

export default CreateRestaurantModal;
