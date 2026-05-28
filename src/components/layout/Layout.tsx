import { StyleSheet, View } from 'react-native';
import Header from './Header';
import { useAuth } from '../../providers/auth.provider';
import { Redirect } from 'expo-router';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();

  if (!session && !loading) {
    return <Redirect href='/signin' />;
  }

  return (
    <View style={styles.layout}>
      <Header />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
  },
});
