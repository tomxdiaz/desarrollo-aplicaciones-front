import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import Layout from '../../src/components/layout/Layout';

export default function AppLayout() {
  return (
    <Layout>
      <Stack screenOptions={{ headerShown: false }} />
    </Layout>
  );
}
