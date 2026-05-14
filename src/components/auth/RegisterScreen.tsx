import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import AuthScreen from './AuthScreen';
import { supabaseService } from '../../services.ts/supabase.service';

export default function RegisterScreen() {
  return (
    <AuthScreen
      buttonText='Registrarme'
      handleAuth={async (email, password) => {
        await supabaseService.signUp(email, password);
        router.navigate('/signin');
      }}
      alternativeActionText='¿Ya tenes cuenta?'
      alternativeActionLinkText='Iniciar Sesion'
      onPressLink={() => router.navigate('/signin')}
    />
  );
}
