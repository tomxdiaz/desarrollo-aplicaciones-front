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
      console.log('[AuthProvider] loadAppUser: session is null → setAppUser(null)');
      setAppUser(null);
      return;
    }

    console.log('[AuthProvider] loadAppUser: calling /app_user/me...');

    const loadedAppUser = await appUserService.getMyAppUser();

    console.log('[AuthProvider] loadAppUser: success →', loadedAppUser.email, loadedAppUser.global_role);

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
      console.log('[AuthProvider] initAuth: started');

      const {
        data: { session: initialSession },
      } = await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      console.log(
        '[AuthProvider] initAuth: getSession() →',
        initialSession ? `session exists (user: ${initialSession.user.email})` : 'null',
      );

      setSession(initialSession);

      try {
        await loadAppUser(initialSession);
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
      console.log('[AuthProvider] onAuthStateChange: event =', event, '| session =', updatedSession ? updatedSession.user.email : 'null');

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
        console.log('[AuthProvider] onAuthStateChange: done → setLoading(false)');
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
