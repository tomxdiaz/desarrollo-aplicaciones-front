import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider } from '../src/providers/auth.provider';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';

SplashScreen.setOptions({
  duration: 3000,
  fade: true,
});

export default function RootLayout() {
  return (
    <AuthProvider>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} enabled>
        <SafeAreaProvider>
          <SafeAreaView style={styles.safeAreaView}>
            <Stack
              screenOptions={{
                animation: 'fade',
                headerShown: false,
              }}
            />
          </SafeAreaView>
        </SafeAreaProvider>
      </KeyboardAvoidingView>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
});
