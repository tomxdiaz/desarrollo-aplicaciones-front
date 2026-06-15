import { Pressable, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../constants/font_sizes';
import { ICON_SIZES } from '../../constants/icon_sizes';

type ModalHeaderProps = {
  title: string;
  /** Second line rendered below the title. */
  subtitle?: string;
  onClose: () => void;
  /** Disables the close button (e.g. while submitting). */
  disabled?: boolean;
  /** Override the outer row container (e.g. alignItems, marginBottom). */
  style?: StyleProp<ViewStyle>;
  /** Override the title Text (e.g. fontSize). */
  titleStyle?: StyleProp<TextStyle>;
  /** Override the close button Pressable (e.g. backgroundColor). */
  closeButtonStyle?: StyleProp<ViewStyle>;
};

const ModalHeader = ({
  title,
  subtitle,
  onClose,
  disabled,
  style,
  titleStyle,
  closeButtonStyle,
}: ModalHeaderProps) => {
  return (
    <View style={[styles.header, style]}>
      <View style={styles.headerTexts}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <Pressable
        style={[styles.closeButton, closeButtonStyle]}
        onPress={onClose}
        disabled={disabled}
        accessibilityRole='button'
        accessibilityLabel='Cerrar'>
        <Ionicons name='close' size={ICON_SIZES.small} color={COLORS.common.gris_oscuro} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: SPACING.small,
  },
  headerTexts: {
    flexShrink: 1,
    gap: SPACING.extra_small,
  },
  title: {
    fontSize: FONT_SIZES.title_small,
    fontWeight: '800',
    color: COLORS.common.negro_principal,
  },
  subtitle: {
    fontSize: FONT_SIZES.text_small,
    color: COLORS.common.gris_medio,
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
});

export default ModalHeader;
