import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../constants/spacing_and_borders';
import { FONT_SIZES } from '../../constants/font_sizes';

type ScreenErrorProps = {
  message: string;
  onRetry: () => void;
};

/** Full-screen centered error message with a retry button. */
const ScreenError = ({ message, onRetry }: ScreenErrorProps) => (
  <View style={styles.centered}>
    <Text style={styles.errorText}>{message}</Text>
    <Pressable style={styles.retryButton} onPress={onRetry}>
      <Text style={styles.retryButtonText}>Reintentar</Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.large,
    gap: SPACING.medium,
  },
  errorText: {
    fontSize: FONT_SIZES.text_base,
    color: COLORS.common.gris_oscuro,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: SPACING.large,
    paddingVertical: SPACING.small,
    borderRadius: BORDER_RADIUS.extra_large,
    backgroundColor: COLORS.primary.terracota,
  },
  retryButtonText: {
    color: COLORS.common.blanco,
    fontWeight: '700',
  },
});

export default ScreenError;
