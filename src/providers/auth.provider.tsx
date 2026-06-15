import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
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

type AuthProviderProps = Readonly<{
  children: React.ReactNode;
}>;

const AuthContext = createContext<AuthContextType>({
  session: null,
  appUser: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAppUser = useCallback(async (currentSession: Session | null) => {
    if (!currentSession) {
      setAppUser(null);
      return;
    }

    const loadedAppUser = await appUserService.getMyAppUser();
    setAppUser(loadedAppUser);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    await supabaseService.signIn(email, password);
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    await supabaseService.signUp(email, password);
  }, []);

  const signOut = useCallback(async () => {
    setSession(null);
    setAppUser(null);

    try {
      await supabaseService.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      setLoading(true);

      const {
        data: { session: initialSession },
      } = await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      setSession(initialSession);

      try {
        await loadAppUser(initialSession);
      } catch (error) {
        console.error('[AuthProvider] initAuth: loadAppUser FAILED →', error);
        setAppUser(null);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initAuth().catch((error) => {
      console.error('[AuthProvider] initAuth FAILED →', error);

      if (mounted) {
        setSession(null);
        setAppUser(null);
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, updatedSession) => {
      if (event === 'TOKEN_REFRESHED') {
        setSession(updatedSession);
        return;
      }

      setLoading(true);
      setSession(updatedSession);

      try {
        await loadAppUser(updatedSession);
      } catch (error) {
        console.error('[AuthProvider] onAuthStateChange: loadAppUser FAILED →', error);
        setAppUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadAppUser]);

  const contextValue = useMemo<AuthContextType>(
    () => ({
      session,
      appUser,
      loading,
      signIn,
      signUp,
      signOut,
    }),
    [session, appUser, loading, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
