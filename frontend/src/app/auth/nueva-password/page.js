"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import styles from "../../login/page.module.css";

export default function NuevaPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasSession(!!session);
      setChecking(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.replace("/");
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

        <h1 className={styles.title}>Nueva contraseña</h1>

        {checking ? (
          <p className={styles.subtitle}>Verificando enlace...</p>
        ) : !hasSession ? (
          <>
            <p className={styles.error}>
              El enlace no es válido o expiró. Pedí uno nuevo desde la pantalla
              de recuperación.
            </p>
            <p className={styles.switch}>
              <Link href="/auth/recuperar" className={styles.switchBtn}>
                Pedir un nuevo enlace
              </Link>
            </p>
          </>
        ) : (
          <>
            <p className={styles.subtitle}>Elegí una contraseña nueva para tu cuenta.</p>

            {error && <p className={styles.error}>{error}</p>}

            <form className={styles.form} onSubmit={handleSubmit}>
              <label className={styles.field}>
                <span className={styles.label}>Nueva contraseña</span>
                <input
                  type="password"
                  className={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Repetir contraseña</span>
                <input
                  type="password"
                  className={styles.input}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repetí la contraseña"
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className={styles.primaryBtn}
              >
                {loading ? "Guardando..." : "Guardar contraseña"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
