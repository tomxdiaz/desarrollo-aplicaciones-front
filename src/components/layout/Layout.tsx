import { StyleSheet, View } from 'react-native';
import Header from './Header';
import { useAuth } from '../../providers/auth.provider';
import { Redirect } from 'expo-router';
import { HeaderRestaurantProvider } from '../../providers/header-restaurant.provider';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();

  if (!session && !loading) {
    return <Redirect href='/signin' />;
  }

  return (
    <HeaderRestaurantProvider>
      <View style={styles.layout}>
        <Header />
        {children}
      </View>
    </HeaderRestaurantProvider>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
  },
});
