import { router } from 'expo-router';
import AuthScreen from './AuthScreen';
import { supabaseService } from '../../services/supabase.service';

export default function SignInScreen() {
  const handleSignIn = async (email: string, password: string) => {
    await supabaseService.signIn(email, password);
    router.push('/');
  };

  return (
    <AuthScreen
      title='Iniciar Sesion'
      buttonText='Iniciar Sesion'
      handleAuth={handleSignIn}
      alternativeActionText='¿No tenes cuenta?'
      alternativeActionLinkText='Registrarme'
      onPressLink={() => router.push('/register')}
    />
  );
}
