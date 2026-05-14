import { router } from 'expo-router';
import AuthScreen from './AuthScreen';
import { supabaseService } from '../../services.ts/supabase.service';

export default function RegisterScreen() {
  const handleSignUp = async (email: string, password: string): Promise<void> => {
    await supabaseService.signUp(email, password);
    router.push('/signin');
  };

  return (
    <AuthScreen
      buttonText='Registrarme'
      handleAuth={handleSignUp}
      alternativeActionText='¿Ya tenes cuenta?'
      alternativeActionLinkText='Iniciar Sesion'
      onPressLink={() => router.push('/signin')}
    />
  );
}
