import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../src/providers/auth.provider';

export default function CheckoutLayout() {
  const { appUser, loading } = useAuth();

  if (!appUser && !loading) {
    return <Redirect href='/signin' />;
  }

  return (
    <Stack screenOptions={{ animation: 'slide_from_right', headerShown: false }} />
  );
}
