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
      setAppUser(null);
      return;
    }

    const appUser = await appUserService.getMyAppUser();
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

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      setSession(session);

      try {
        await loadAppUser(session);
      } catch (error) {
        console.error('Error loading app user:', error);
        setAppUser(null);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setLoading(true);
      setSession(session);

      try {
        await loadAppUser(session);
      } catch (error) {
        console.error('Error loading app user:', error);
        setAppUser(null);
      } finally {
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
