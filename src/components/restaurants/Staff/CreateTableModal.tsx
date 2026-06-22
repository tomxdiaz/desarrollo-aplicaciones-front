import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { FONT_SIZES } from '../../../constants/font_sizes';
import { SPACING } from '../../../constants/spacing_and_borders';
import { modalInputStyle } from '../../../constants/sharedInputStyles';
import { CreateTablePayload } from '../../../types/types';
import CenterModal from '../../shared/CenterModal';
import ModalActionButtons from '../../shared/ModalActionButtons';

const CODE_MAX = 4;
const AREA_MAX = 20;

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
    const parsedCapacity = Number.parseInt(capacity, 10);

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

      <View>
        <TextInput
          style={styles.input}
          placeholder='Código (ej: 1A)'
          placeholderTextColor={COLORS.common.gris_medio}
          value={code}
          onChangeText={setCode}
          maxLength={CODE_MAX}
          autoCapitalize='characters'
        />
        <Text style={styles.counter}>{code.length}/{CODE_MAX}</Text>
      </View>
      <View>
        <TextInput
          style={styles.input}
          placeholder='Área (opcional)'
          placeholderTextColor={COLORS.common.gris_medio}
          value={area}
          onChangeText={setArea}
          maxLength={AREA_MAX}
        />
        <Text style={styles.counter}>{area.length}/{AREA_MAX}</Text>
      </View>
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
  counter: {
    fontSize: FONT_SIZES.text_small,
    color: COLORS.common.gris_medio,
    textAlign: 'right',
    marginTop: SPACING.small,
  },
});

export default CreateTableModal;
