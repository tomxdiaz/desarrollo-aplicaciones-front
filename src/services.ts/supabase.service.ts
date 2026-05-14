import { supabase } from '../lib/supabaseClient';

export const supabaseService = {
  signIn: async (email: string, password: string): Promise<string> => {
    console.log('Signing up with email:', email, 'and password:', password);

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
    console.log('Signing up with email:', email, 'and password:', password);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (!data || error) {
      console.log(error)
      throw error;
    }
  },
};
