import { supabase } from '../lib/supabaseClient';

export const supabaseService = {
  signIn: async (email: string, password: string): Promise<string> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!data || error) {
      throw error;
    }

    return data.session.access_token;
  },

  signUp: async (email: string, password: string): Promise<void> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (!data || error) {
      throw error;
    }
  },

  signOut: async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  },
};
