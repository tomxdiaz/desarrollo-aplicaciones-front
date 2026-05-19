import { StyleSheet, View } from 'react-native';
import Header from './Header';
import { useAuth } from '../../providers/auth.provider';
import { Redirect, router } from 'expo-router';
import { useEffect } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { appUser, loading } = useAuth();

  if (!appUser && !loading) {
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
