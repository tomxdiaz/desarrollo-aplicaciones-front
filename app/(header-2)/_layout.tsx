import { Stack } from 'expo-router';
import Layout2 from '../../src/components/layout/Layout-2';

export default function Header2Layout() {
  return (
    <Layout2>
      <Stack
        screenOptions={{
          animation: 'fade',
          headerShown: false,
        }}
      />
    </Layout2>
  );
}
