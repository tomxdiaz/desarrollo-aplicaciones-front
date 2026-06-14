import { Stack } from 'expo-router';
import Layout1 from '../../src/components/layout/Layout-1';

export default function Header1Layout() {
  return (
    <Layout1>
      <Stack
        screenOptions={{
          animation: 'fade',
          headerShown: false,
        }}
      />
    </Layout1>
  );
}
