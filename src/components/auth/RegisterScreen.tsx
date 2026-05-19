import { router } from 'expo-router';
import AuthScreen from './AuthScreen';
import { supabaseService } from '../../services/supabase.service';

export default function RegisterScreen() {
  const handleSignUp = async (email: string, password: string): Promise<void> => {
    await supabaseService.signUp(email, password);
    router.navigate('/signin');
  };

  return (
    <AuthScreen
      title='Crear Cuenta'
      buttonText='Registrarme'
      handleAuth={handleSignUp}
      alternativeActionText='¿Ya tenes cuenta?'
      alternativeActionLinkText='Iniciar Sesion'
      onPressLink={() => router.navigate('/signin')}
    />
  );
}
