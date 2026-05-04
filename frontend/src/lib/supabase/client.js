"use client";

import { createClient } from "@supabase/supabase-js";

// Cliente para Client Components (browser).
// Usa la anon key — segura para exponer al cliente porque las RLS policies
// controlan qué puede hacer cada visitante.

let browserClient = null;

export function getSupabaseBrowserClient() {
  if (browserClient) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;

  browserClient = createClient(url, anonKey);
  return browserClient;
}

export function isSupabaseConfigured() {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
