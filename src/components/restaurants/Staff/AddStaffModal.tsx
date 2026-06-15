import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { ApiError } from '../../../lib/apiClient';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import { modalInputStyle } from '../../../constants/sharedInputStyles';
import { CreateStaffPayload, RestaurantStaffEnum } from '../../../types/types';
import { getAssignableRoles } from '../../../utils/staffPermissions';
import CenterModal from '../../shared/CenterModal';
import ModalActionButtons from '../../shared/ModalActionButtons';
import RolePicker from '../../shared/RolePicker';

const AddStaffModal = ({
  visible,
  currentUserRole,
  onClose,
  onAdd,
}: {
  visible: boolean;
  currentUserRole: RestaurantStaffEnum;
  onClose: () => void;
  onAdd: (payload: CreateStaffPayload) => Promise<void>;
}) => {
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<RestaurantStaffEnum | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);

  const assignableRoles = getAssignableRoles(currentUserRole);

  const reset = () => {
    setEmail('');
    setSelectedRole(null);
    setInlineError(null);
  };

  const handleClose = () => {
    if (submitting) return;
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setInlineError('Ingresá un email.');
      return;
    }

    if (!selectedRole) {
      setInlineError('Seleccioná un rol.');
      return;
    }

    setInlineError(null);
    setSubmitting(true);

    try {
      await onAdd({ email: trimmedEmail, role: selectedRole });
      reset();
      onClose();
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.message.includes('does not exist')) {
          setInlineError('No existe un usuario con ese email.');
        } else if (error.message.includes('ya es parte')) {
          setInlineError('Este usuario ya es parte del personal.');
        } else {
          Alert.alert('Error', 'No se pudo agregar el personal. Intentá de nuevo.');
        }
      } else {
        Alert.alert('Error', 'No se pudo agregar el personal. Intentá de nuevo.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CenterModal visible={visible} onClose={handleClose}>
      <Text style={styles.title}>Agregar personal</Text>

      <TextInput
        style={styles.input}
        placeholder='Email'
        placeholderTextColor={COLORS.common.gris_medio}
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setInlineError(null);
        }}
        keyboardType='email-address'
        autoCapitalize='none'
        autoCorrect={false}
      />

      <View style={styles.roleSection}>
        <Text style={styles.roleLabel}>Rol</Text>
        <RolePicker
          roles={assignableRoles}
          selectedRole={selectedRole}
          onSelect={(role) => {
            setSelectedRole(role);
            setInlineError(null);
          }}
        />
      </View>

      {inlineError ? <Text style={styles.inlineError}>{inlineError}</Text> : null}

      <ModalActionButtons
        onCancel={handleClose}
        onConfirm={handleSubmit}
        confirmLabel='Agregar'
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
  roleSection: {
    gap: SPACING.small,
  },
  roleLabel: {
    fontSize: FONT_SIZES.text_small,
    fontWeight: '700',
    color: COLORS.common.gris_oscuro,
  },
  inlineError: {
    fontSize: FONT_SIZES.text_small,
    color: COLORS.status.error,
  },
});

export default AddStaffModal;
