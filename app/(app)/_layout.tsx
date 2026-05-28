import { Stack } from 'expo-router';
import Layout from '../../src/components/layout/Layout';

export default function AppLayout() {
  return (
    <Layout>
      <Stack
        screenOptions={{
          animation: 'fade',
          headerShown: false,
        }}
      />
    </Layout>
  );
}
