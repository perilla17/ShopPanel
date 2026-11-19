import { createContext, useContext, useEffect, useState } from 'react';
import { signInWithPassword, signOutFromSupabase } from '../services/authService.js';
import { supabase } from '../services/supabaseClient.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(Boolean(supabase));

  useEffect(() => {
    if (!supabase) return;

    // Supabase entrega la sesión inicial y avisa cuando cambia.
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{
      session,
      user: session?.user ?? null,
      loading,
      configured: Boolean(supabase),
      signIn: signInWithPassword,
      signOut: signOutFromSupabase,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error('useAuth debe usarse dentro de AuthProvider.');
  return auth;
}
