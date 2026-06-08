import { createClient } from "@supabase/supabase-js";

// Cliente para Server Components, Server Actions y API Routes.
// Usa la anon key — RLS controla los permisos.
// Para tareas de admin (bypass RLS), se podria usar SUPABASE_SERVICE_ROLE_KEY
// pero por ahora no la necesitamos.

let serverClient = null;

export function getSupabaseServerClient() {
  if (serverClient) return serverClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) return null;

  serverClient = createClient(url, key, {
    auth: { persistSession: false },
  });
  return serverClient;
}

export function isSupabaseConfigured() {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

// Cliente admin (bypass RLS) usando service_role.
// Usar SÓLO en endpoints del backend para flujos trusted donde la validación
// se hace en código (ej. createOrder valida items contra products antes de
// insertar). NUNCA exponer el service_role al cliente.
let adminClient = null;

export function getSupabaseAdminClient() {
  if (adminClient) return adminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  adminClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return adminClient;
}

// Cliente por-request que hereda la sesión del usuario via Authorization: Bearer.
// Necesario para que auth.uid() funcione dentro de funciones SECURITY DEFINER
// (la función checkout() depende de auth.uid()).
export function getSupabaseUserClient(accessToken) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key || !accessToken) return null;

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}
