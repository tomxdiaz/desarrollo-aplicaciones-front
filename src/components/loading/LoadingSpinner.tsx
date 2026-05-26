import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { COLORS } from '../../constants/colors';

const LoadingSpinner = () => {
  return (
    <View style={styles.centered}>
      <ActivityIndicator size='large' color={COLORS.primary.terracota} />
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.common.gris_muy_claro,
  },
});

export default LoadingSpinner;
