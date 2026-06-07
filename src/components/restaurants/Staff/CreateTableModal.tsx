import { useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import { CreateTablePayload } from '../../../types/types';

const CreateTableModal = ({
  visible,
  onClose,
  onCreate,
}: {
  visible: boolean;
  onClose: () => void;
  onCreate: (payload: CreateTablePayload) => Promise<void>;
}) => {
  const [code, setCode] = useState('');
  const [area, setArea] = useState('');
  const [capacity, setCapacity] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setCode('');
    setArea('');
    setCapacity('');
  };

  const handleClose = () => {
    if (submitting) return;
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    const trimmedCode = code.trim();
    const parsedCapacity = parseInt(capacity, 10);

    if (!trimmedCode) {
      Alert.alert('Falta el código', 'Ingresá el código de la mesa.');
      return;
    }

    if (!Number.isFinite(parsedCapacity) || parsedCapacity <= 0) {
      Alert.alert('Capacidad inválida', 'Ingresá un número de personas mayor a cero.');
      return;
    }

    setSubmitting(true);

    try {
      await onCreate({
        code: trimmedCode,
        area: area.trim() || undefined,
        capacity: parsedCapacity,
      });
      reset();
      onClose();
    } catch (error) {
      console.error('Error creating table:', error);
      Alert.alert('Error', 'No se pudo crear la mesa. Intentá de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType='fade' onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Nueva mesa</Text>

          <TextInput
            style={styles.input}
            placeholder='Código (ej: 1A)'
            placeholderTextColor={COLORS.common.gris_medio}
            value={code}
            onChangeText={setCode}
            autoCapitalize='characters'
          />
          <TextInput
            style={styles.input}
            placeholder='Área (opcional)'
            placeholderTextColor={COLORS.common.gris_medio}
            value={area}
            onChangeText={setArea}
          />
          <TextInput
            style={styles.input}
            placeholder='Capacidad (personas)'
            placeholderTextColor={COLORS.common.gris_medio}
            value={capacity}
            onChangeText={setCapacity}
            keyboardType='number-pad'
          />

          <View style={styles.actionsRow}>
            <Pressable style={styles.cancelButton} onPress={handleClose} disabled={submitting}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </Pressable>
            <Pressable style={styles.createButton} onPress={handleSubmit} disabled={submitting}>
              {submitting ? <ActivityIndicator color={COLORS.common.blanco} /> : <Text style={styles.createButtonText}>Crear mesa</Text>}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.large,
  },
  sheet: {
    width: '100%',
    backgroundColor: COLORS.common.blanco,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.large,
    gap: SPACING.medium,
  },
  title: {
    fontSize: FONT_SIZES.title_small,
    fontWeight: '800',
    color: COLORS.common.negro_principal,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.common.gris_claro,
    borderRadius: BORDER_RADIUS.medium,
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.medium,
    fontSize: FONT_SIZES.text_base,
    color: COLORS.common.negro_principal,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: SPACING.small,
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.medium,
    borderRadius: BORDER_RADIUS.extra_large,
    borderWidth: 1,
    borderColor: COLORS.common.gris_claro,
  },
  cancelButtonText: {
    color: COLORS.common.gris_oscuro,
    fontWeight: '700',
  },
  createButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.medium,
    borderRadius: BORDER_RADIUS.extra_large,
    backgroundColor: COLORS.primary.terracota,
  },
  createButtonText: {
    color: COLORS.common.blanco,
    fontWeight: '700',
  },
});

export default CreateTableModal;
