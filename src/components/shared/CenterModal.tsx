import { Modal, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { COLORS } from '../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../constants/spacing_and_borders';

type CenterModalProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const CenterModal = ({ visible, onClose, children }: CenterModalProps) => {
  return (
    <Modal visible={visible} transparent animationType='fade' onRequestClose={onClose}>
      <View style={styles.overlay}>
        <KeyboardAwareScrollView
          style={styles.sheetWrapper}
          contentContainerStyle={styles.sheet}
          keyboardShouldPersistTaps='handled'
          enableOnAndroid
          extraScrollHeight={80}
          showsVerticalScrollIndicator={false}>
          {children}
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
});

export default CenterModal;
