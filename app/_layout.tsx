import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../src/providers/auth.provider';
import { CartProvider } from '../src/providers/cart.provider';

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <SafeAreaProvider>
          <StatusBar style="light" backgroundColor="#000000" />
          <SafeAreaView style={styles.safeAreaView}>
            <Stack screenOptions={{ animation: 'fade', headerShown: false }} />
          </SafeAreaView>
        </SafeAreaProvider>
      </CartProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
});
