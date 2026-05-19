import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
