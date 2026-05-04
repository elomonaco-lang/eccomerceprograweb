import { createClient } from "@supabase/supabase-js";

// Cliente para Server Components, Server Actions y API Routes.
// Usa la anon key — RLS controla los permisos.
// Para tareas de admin (bypass RLS), se podria usar SUPABASE_SERVICE_ROLE_KEY
// pero por ahora no la necesitamos.

let serverClient = null;

export function getSupabaseServerClient() {
  if (serverClient) return serverClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;

  serverClient = createClient(url, anonKey, {
    auth: { persistSession: false },
  });
  return serverClient;
}

export function isSupabaseConfigured() {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
