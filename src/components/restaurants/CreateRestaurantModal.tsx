import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { COLORS } from '../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../constants/font_sizes';
import { ICON_SIZES } from '../../constants/icon_sizes';
import { CreateRestaurantPayload } from '../../types/types';

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
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setName('');
    setDescription('');
    setAddress('');
  };

  const handleClose = () => {
    if (submitting) return;
    reset();
    onClose();
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
    <Modal visible={visible} transparent animationType='slide' onRequestClose={handleClose}>
      <Pressable style={styles.overlay} onPress={handleClose}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardView}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.handle} />

            <View style={styles.header}>
              <Text style={styles.title}>Crear Restaurante</Text>
              <Pressable
                style={styles.closeButton}
                onPress={handleClose}
                disabled={submitting}
                accessibilityRole='button'
                accessibilityLabel='Cerrar'>
                <Ionicons name='close' size={ICON_SIZES.small} color={COLORS.common.gris_oscuro} />
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false}>
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
                <Text style={styles.label}>Descripcion</Text>
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
                <Text style={styles.label}>Ubicacion</Text>
                <TextInput
                  style={styles.input}
                  placeholder='Barrio, Ciudad'
                  placeholderTextColor={COLORS.common.gris_medio}
                  value={address}
                  onChangeText={setAddress}
                  editable={!submitting}
                />
              </View>

              <Pressable style={styles.createButton} onPress={handleSubmit} disabled={submitting}>
                {submitting ? (
                  <ActivityIndicator color={COLORS.common.blanco} />
                ) : (
                  <Text style={styles.createButtonText}>Crear Restaurante</Text>
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
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  keyboardView: {
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.surface.fondo_crema,
    borderTopLeftRadius: BORDER_RADIUS.large,
    borderTopRightRadius: BORDER_RADIUS.large,
    paddingHorizontal: SPACING.large,
    paddingBottom: SPACING.extra_large,
    paddingTop: SPACING.small,
    maxHeight: '90%',
  },
  handle: {
    alignSelf: 'center',
    width: 48,
    height: 4,
    borderRadius: 2,
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
    fontSize: FONT_SIZES.title_small,
    fontWeight: '800',
    color: COLORS.common.negro_principal,
  },
  closeButton: {
    width: ICON_SIZES.large,
    height: ICON_SIZES.large,
    borderRadius: ICON_SIZES.large,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.common.blanco,
    borderWidth: 1,
    borderColor: COLORS.surface.borde_calido,
  },
  form: {
    gap: SPACING.medium,
    paddingBottom: SPACING.small,
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
