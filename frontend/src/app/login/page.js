"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import styles from "./page.module.css";

// Traduce los mensajes de error de Supabase a algo legible en español.
function traducirError(message) {
  if (!message) return "Ocurrió un error. Intentá de nuevo.";
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials"))
    return "Email o contraseña incorrectos.";
  if (m.includes("email not confirmed"))
    return "Confirmá tu email antes de ingresar. Revisá tu correo.";
  if (m.includes("user already registered") || m.includes("already been registered"))
    return "Ya existe una cuenta con ese email. Probá iniciar sesión.";
  if (m.includes("password should be at least"))
    return "La contraseña debe tener al menos 6 caracteres.";
  if (m.includes("unable to validate email") || m.includes("invalid email"))
    return "El email no es válido.";
  return message;
}

function LoginContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const supabase = createClient();

  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  useEffect(() => {
    if (searchParams.get("error")) {
      setError("Ocurrió un error al iniciar sesión. Intentá de nuevo.");
    }
  }, [searchParams]);

  function switchMode(next) {
    setMode(next);
    setError("");
    setInfo("");
  }

  async function handleGoogleLogin() {
    setLoading(true);
    setError("");
    setInfo("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(traducirError(error.message));
      setLoading(false);
    }
  }

  async function handleEmailSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        setError(traducirError(error.message));
        setLoading(false);
        return;
      }
      // El listener de AuthContext + el useEffect de arriba redirigen a "/".
      router.replace("/");
    } else {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: name.trim() || undefined },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        setError(traducirError(error.message));
        setLoading(false);
        return;
      }
      // Si el proyecto exige confirmación de email, no hay sesión todavía.
      if (!data.session) {
        setInfo(
          "Te enviamos un correo para confirmar tu cuenta. Revisá tu bandeja (y el spam) para terminar el registro."
        );
        setLoading(false);
        return;
      }
      router.replace("/");
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoArea}>
          <div className={styles.logoMark} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2.5C6.8 2.5 3 6 3 10c0 2.4 1.4 5.6 3.3 8.3 1 1.4 2.1 2.6 3.1 3.4.6.5 1.2.8 1.7.8h1.8c.5 0 1.1-.3 1.7-.8 1-.8 2.1-2 3.1-3.4 1.9-2.7 3.3-5.9 3.3-8.3 0-4-3.8-7.5-9-7.5zm0 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"
              />
            </svg>
          </div>
          <span className={styles.brandName}>MusicTrack</span>
        </div>

        <h1 className={styles.title}>
          {mode === "login" ? "Bienvenido" : "Creá tu cuenta"}
        </h1>
        <p className={styles.subtitle}>
          {mode === "login"
            ? "Iniciá sesión para guardar tu carrito y gestionar tus pedidos."
            : "Registrate para guardar tu carrito y seguir tus pedidos."}
        </p>

        {error && <p className={styles.error}>{error}</p>}
        {info && <p className={styles.info}>{info}</p>}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className={styles.googleBtn}
        >
          {!loading && (
            <svg
              className={styles.googleIcon}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          {loading ? "Procesando..." : "Continuar con Google"}
        </button>

        <div className={styles.divider}>
          <span>o</span>
        </div>

        <form className={styles.form} onSubmit={handleEmailSubmit}>
          {mode === "signup" && (
            <label className={styles.field}>
              <span className={styles.label}>Nombre</span>
              <input
                type="text"
                className={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                autoComplete="name"
              />
            </label>
          )}

          <label className={styles.field}>
            <span className={styles.label}>Email</span>
            <input
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              autoComplete="email"
              required
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Contraseña</span>
            <input
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === "signup" ? "Mínimo 6 caracteres" : "••••••••"}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              minLength={6}
              required
            />
          </label>

          {mode === "login" && (
            <Link href="/auth/recuperar" className={styles.forgotLink}>
              ¿Olvidaste tu contraseña?
            </Link>
          )}

          <button type="submit" disabled={loading} className={styles.primaryBtn}>
            {loading
              ? "Procesando..."
              : mode === "login"
                ? "Ingresar"
                : "Crear cuenta"}
          </button>
        </form>

        <p className={styles.switch}>
          {mode === "login" ? (
            <>
              ¿No tenés cuenta?{" "}
              <button
                type="button"
                className={styles.switchBtn}
                onClick={() => switchMode("signup")}
              >
                Registrate
              </button>
            </>
          ) : (
            <>
              ¿Ya tenés cuenta?{" "}
              <button
                type="button"
                className={styles.switchBtn}
                onClick={() => switchMode("login")}
              >
                Iniciá sesión
              </button>
            </>
          )}
        </p>

        <p className={styles.legal}>
          Al continuar, aceptás los términos y condiciones del sitio.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
