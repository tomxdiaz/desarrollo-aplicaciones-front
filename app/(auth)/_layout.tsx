import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../src/providers/auth.provider';

export default function AuthLayout() {
  const { appUser, loading } = useAuth();

  if (appUser && !loading) {
    return <Redirect href='/' />;
  }

  return (
    <Stack
      screenOptions={{
        animation: 'fade',
        headerShown: false,
      }}
    />
  );
}
