import { Modal, Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import type { DimensionValue } from 'react-native';
import { COLORS } from '../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../constants/spacing_and_borders';

type BottomSheetModalProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Defaults to '85%'. Pass '92%' for taller sheets. */
  maxHeight?: DimensionValue;
  /** Defaults to 'fade'. Pass 'slide' for bottom-up entrance. */
  animationType?: 'fade' | 'slide' | 'none';
  /** Override or extend the inner sheet container styles. */
  sheetStyle?: StyleProp<ViewStyle>;
};

const BottomSheetModal = ({
  visible,
  onClose,
  children,
  maxHeight = '85%',
  animationType = 'fade',
  sheetStyle,
}: BottomSheetModalProps) => {
  return (
    <Modal visible={visible} transparent animationType={animationType} onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        {/* Inner Pressable stops tap-through from closing the modal when touching the sheet. */}
        <Pressable style={[styles.sheet, { maxHeight }, sheetStyle]} onPress={() => {}}>
          {children}
        </Pressable>
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
  sheet: {
    backgroundColor: COLORS.surface.fondo_crema,
    borderTopLeftRadius: BORDER_RADIUS.large,
    borderTopRightRadius: BORDER_RADIUS.large,
    padding: SPACING.large,
    gap: SPACING.medium,
  },
});

export default BottomSheetModal;
