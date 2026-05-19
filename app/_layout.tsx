import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider } from '../src/providers/auth.provider';
import { StyleSheet } from 'react-native';

SplashScreen.setOptions({
  duration: 3000,
  fade: true,
});

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeAreaView}>
          <Stack screenOptions={{ headerShown: false }} />
        </SafeAreaView>
      </SafeAreaProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
});
