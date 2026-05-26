import { useLocalSearchParams } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';
import { FONT_SIZES } from '../../../../src/constants/font_sizes';

export default function MyOrderDetailPage() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pedido #{id}</Text>
      <Text style={styles.subtitle}>Detalle del pedido (pendiente implementar)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: FONT_SIZES.title_base, fontWeight: '800' },
  subtitle: { fontSize: FONT_SIZES.text_base, color: '#666', marginTop: 8 },
});
