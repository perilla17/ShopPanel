import { supabase } from './supabaseClient.js';

const errorConfiguracion = {
  message: 'Falta configurar Supabase para iniciar o cerrar sesión.',
};

export async function signInWithPassword(email, password) {
  if (!supabase) return { error: errorConfiguracion };
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOutFromSupabase() {
  if (!supabase) return { error: errorConfiguracion };
  return supabase.auth.signOut();
}
