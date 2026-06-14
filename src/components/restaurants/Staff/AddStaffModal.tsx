import { useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ApiError } from '../../../lib/apiClient';
import { COLORS } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import { CreateStaffPayload, RestaurantStaffEnum } from '../../../types/types';
import { RESTAURANT_STAFF_ROLE_LABELS } from '../../../types/restaurant-staff-role';
import { getAssignableRoles } from '../../../utils/staffPermissions';

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
    <Modal visible={visible} transparent animationType='fade' onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <KeyboardAwareScrollView
          style={styles.sheetWrapper}
          contentContainerStyle={styles.sheet}
          keyboardShouldPersistTaps='handled'
          enableOnAndroid
          extraScrollHeight={80}
          showsVerticalScrollIndicator={false}>
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
            <View style={styles.rolePillsRow}>
              {assignableRoles.map((role) => {
                const isActive = selectedRole === role;
                return (
                  <Pressable
                    key={role}
                    style={[styles.rolePill, isActive ? styles.rolePillActive : styles.rolePillInactive]}
                    onPress={() => {
                      setSelectedRole(role);
                      setInlineError(null);
                    }}
                  >
                    <Text style={[styles.rolePillText, isActive ? styles.rolePillTextActive : styles.rolePillTextInactive]}>
                      {RESTAURANT_STAFF_ROLE_LABELS[role]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {inlineError ? <Text style={styles.inlineError}>{inlineError}</Text> : null}

          <View style={styles.actionsRow}>
            <Pressable style={styles.cancelButton} onPress={handleClose} disabled={submitting}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </Pressable>
            <Pressable style={styles.createButton} onPress={handleSubmit} disabled={submitting}>
              {submitting ? (
                <ActivityIndicator color={COLORS.common.blanco} />
              ) : (
                <Text style={styles.createButtonText}>Agregar</Text>
              )}
            </Pressable>
          </View>
        </KeyboardAwareScrollView>
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
  sheetWrapper: {
    width: '100%',
    backgroundColor: COLORS.common.blanco,
    borderRadius: BORDER_RADIUS.medium,
    overflow: 'hidden',
  },
  sheet: {
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
    borderColor: COLORS.surface.borde_calido,
    borderRadius: BORDER_RADIUS.small,
    backgroundColor: COLORS.surface.fondo_crema,
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.medium,
    fontSize: FONT_SIZES.text_base,
    color: COLORS.common.negro_principal,
  },
  roleSection: {
    gap: SPACING.small,
  },
  roleLabel: {
    fontSize: FONT_SIZES.text_small,
    fontWeight: '700',
    color: COLORS.common.gris_oscuro,
  },
  rolePillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.small,
  },
  rolePill: {
    height: 34,
    justifyContent: 'center',
    paddingHorizontal: SPACING.medium,
    borderRadius: BORDER_RADIUS.large,
    borderWidth: 1,
  },
  rolePillActive: {
    backgroundColor: COLORS.primary.terracota,
    borderColor: COLORS.primary.terracota,
  },
  rolePillInactive: {
    backgroundColor: COLORS.common.blanco,
    borderColor: COLORS.surface.borde_calido,
  },
  rolePillText: {
    fontSize: FONT_SIZES.text_small,
    fontWeight: '600',
  },
  rolePillTextActive: {
    color: COLORS.common.blanco,
  },
  rolePillTextInactive: {
    color: COLORS.primary.terracota,
  },
  inlineError: {
    fontSize: FONT_SIZES.text_small,
    color: COLORS.status.error,
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
    borderColor: COLORS.surface.borde_calido,
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

export default AddStaffModal;
