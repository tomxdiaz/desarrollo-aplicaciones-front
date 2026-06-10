import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../../constants/font_sizes';
import { ICON_SIZES } from '../../../constants/icon_sizes';

const DeleteMenuItemModal = ({
  visible,
  title,
  description,
  confirmLabel,
  onClose,
  onConfirm,
  submitting,
}: {
  visible: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  submitting: boolean;
}) => {
  return (
    <Modal visible={visible} transparent animationType='fade' onRequestClose={submitting ? undefined : onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.iconWrap}>
            <Ionicons name='trash-outline' size={ICON_SIZES.large} color={COLORS.surface.rojo_texto} />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>

          <View style={styles.actionsRow}>
            <Pressable style={styles.cancelButton} onPress={onClose} disabled={submitting}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </Pressable>
            <Pressable style={styles.deleteButton} onPress={onConfirm} disabled={submitting}>
              {submitting ? <ActivityIndicator color={COLORS.common.blanco} /> : <Text style={styles.deleteButtonText}>{confirmLabel}</Text>}
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
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.large,
  },
  sheet: {
    width: '100%',
    backgroundColor: COLORS.common.blanco,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.large,
    gap: SPACING.medium,
  },
  iconWrap: {
    alignSelf: 'center',
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.medium,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface.rojo_suave,
  },
  title: {
    textAlign: 'center',
    fontSize: FONT_SIZES.title_base,
    fontWeight: '800',
    color: COLORS.common.negro_principal,
  },
  description: {
    textAlign: 'center',
    color: COLORS.common.gris_oscuro,
    fontSize: FONT_SIZES.text_base,
    lineHeight: 24,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: SPACING.small,
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.medium,
    borderRadius: BORDER_RADIUS.extra_large,
    backgroundColor: COLORS.surface.fondo_crema,
  },
  cancelButtonText: {
    color: COLORS.common.gris_oscuro,
    fontWeight: '700',
    fontSize: FONT_SIZES.text_base,
  },
  deleteButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.medium,
    borderRadius: BORDER_RADIUS.extra_large,
    backgroundColor: COLORS.surface.rojo_texto,
  },
  deleteButtonText: {
    color: COLORS.common.blanco,
    fontWeight: '700',
    fontSize: FONT_SIZES.text_base,
  },
});

export default DeleteMenuItemModal;
