import { createContext, useContext, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { supabaseService } from '../services/supabase.service';
import type { AppUser } from '../types/types';
import { appUserService } from '../services/app_user.service';

type AuthContextType = {
  session: Session | null;
  appUser: AppUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  appUser: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAppUser = async (session: Session | null) => {
    if (!session) {
      console.log('[AuthProvider] loadAppUser: session is null → setAppUser(null)');
      setAppUser(null);
      return;
    }

    console.log('[AuthProvider] loadAppUser: calling /app_user/me...');
    const appUser = await appUserService.getMyAppUser();
    console.log('[AuthProvider] loadAppUser: success →', appUser.email, appUser.global_role);
    setAppUser(appUser);
  };

  const signIn = async (email: string, password: string) => {
    await supabaseService.signIn(email, password);
    // No hace falta setear acá si onAuthStateChange lo va a capturar.
  };

  const signUp = async (email: string, password: string) => {
    await supabaseService.signUp(email, password);
  };

  const signOut = async () => {
    setSession(null);
    setAppUser(null);

    try {
      await supabaseService.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      setLoading(true);
      console.log('[AuthProvider] initAuth: started');

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      console.log('[AuthProvider] initAuth: getSession() →', session ? `session exists (user: ${session.user.email})` : 'null');
      setSession(session);

      try {
        await loadAppUser(session);
      } catch (error) {
        console.error('[AuthProvider] initAuth: loadAppUser FAILED →', error);
        setAppUser(null);
      } finally {
        if (mounted) {
          console.log('[AuthProvider] initAuth: done → setLoading(false)');
          setLoading(false);
        }
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AuthProvider] onAuthStateChange: event =', event, '| session =', session ? session.user.email : 'null');

      if (event === 'TOKEN_REFRESHED') {
        setSession(session);
        return;
      }

      setLoading(true);
      setSession(session);

      try {
        await loadAppUser(session);
      } catch (error) {
        console.error('[AuthProvider] onAuthStateChange: loadAppUser FAILED →', error);
        setAppUser(null);
      } finally {
        console.log('[AuthProvider] onAuthStateChange: done → setLoading(false)');
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        appUser,
        loading,
        signIn,
        signUp,
        signOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
