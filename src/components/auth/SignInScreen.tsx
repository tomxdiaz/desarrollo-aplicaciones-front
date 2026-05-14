import { router } from 'expo-router';
import React, { useState } from 'react';
import AuthScreen from './AuthScreen';
import { supabaseService } from '../../services.ts/supabase.service';

export default function SignInScreen() {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const handleSignIn = async (email: string, password: string) => {
    const access_token = await supabaseService.signIn(email, password);
    console.log('Access token received:', access_token);
    setAccessToken(access_token);
  };

  return (
    <AuthScreen
      buttonText='Iniciar Sesion'
      handleAuth={handleSignIn}
      alternativeActionText='¿No tenes cuenta?'
      alternativeActionLinkText='Registrarme'
      onPressLink={() => router.navigate('/register')}
    />
  );
}
