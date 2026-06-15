import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { FONT_SIZES } from '../../../constants/font_sizes';
import { modalInputStyle } from '../../../constants/sharedInputStyles';
import { CreateTablePayload } from '../../../types/types';
import CenterModal from '../../shared/CenterModal';
import ModalActionButtons from '../../shared/ModalActionButtons';

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
    <CenterModal visible={visible} onClose={handleClose}>
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

      <ModalActionButtons
        onCancel={handleClose}
        onConfirm={handleSubmit}
        confirmLabel='Crear mesa'
        disabled={submitting}
        loading={submitting}
      />
    </CenterModal>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: FONT_SIZES.title_small,
    fontWeight: '800',
    color: COLORS.common.negro_principal,
  },
  input: modalInputStyle,
});

export default CreateTableModal;
