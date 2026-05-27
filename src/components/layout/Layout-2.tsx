import { StyleSheet, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '../../providers/auth.provider';
import { CartProvider } from '../../providers/cart.provider';
import Header2 from './Header-2';

export default function Layout2({ children }: { children: React.ReactNode }) {
  const { appUser, loading } = useAuth();

  if (!appUser && !loading) {
    return <Redirect href='/signin' />;
  }

  return (
    <CartProvider>
      <View style={styles.layout}>
        <Header2 />
        {children}
      </View>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
  },
});
