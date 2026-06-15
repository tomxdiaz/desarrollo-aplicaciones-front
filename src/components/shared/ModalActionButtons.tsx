import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../constants/spacing_and_borders';

type ModalActionButtonsProps = {
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel: string;
  disabled?: boolean;
  loading?: boolean;
};

const ModalActionButtons = ({
  onCancel,
  onConfirm,
  confirmLabel,
  disabled,
  loading,
}: ModalActionButtonsProps) => {
  return (
    <View style={styles.actionsRow}>
      <Pressable style={styles.cancelButton} onPress={onCancel} disabled={disabled}>
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </Pressable>
      <Pressable style={styles.createButton} onPress={onConfirm} disabled={disabled}>
        {loading ? (
          <ActivityIndicator color={COLORS.common.blanco} />
        ) : (
          <Text style={styles.createButtonText}>{confirmLabel}</Text>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default ModalActionButtons;
