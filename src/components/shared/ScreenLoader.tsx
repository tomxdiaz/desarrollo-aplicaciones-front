import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing_and_borders';

/** Full-screen centered loading spinner, no background. */
const ScreenLoader = () => (
  <View style={styles.centered}>
    <ActivityIndicator size='large' color={COLORS.primary.terracota} />
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
});

export default ScreenLoader;
