import { StyleSheet, View } from 'react-native';
import Header1 from './Header-1';
import { useAuth } from '../../providers/auth.provider';
import { Redirect } from 'expo-router';

export default function Layout1({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();

  if (!session && !loading) {
    return <Redirect href='/signin' />;
  }

  return (
    <View style={styles.layout}>
      <Header1 />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
  },
});
