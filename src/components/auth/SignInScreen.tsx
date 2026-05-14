import { router } from 'expo-router';
import AuthScreen from './AuthScreen';
import { supabaseService } from '../../services.ts/supabase.service';

export default function SignInScreen() {
  const handleSignIn = async (email: string, password: string) => {
    await supabaseService.signIn(email, password);
  };

  return (
    <AuthScreen
      buttonText='Iniciar Sesion'
      handleAuth={handleSignIn}
      alternativeActionText='¿No tenes cuenta?'
      alternativeActionLinkText='Registrarme'
      onPressLink={() => router.push('/register')}
    />
  );
}
