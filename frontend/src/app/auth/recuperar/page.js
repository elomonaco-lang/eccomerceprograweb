"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import styles from "../../login/page.module.css";

export default function RecuperarPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const supabase = createClient();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/nueva-password`,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
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

        <h1 className={styles.title}>Recuperar contraseña</h1>

        {sent ? (
          <>
            <p className={styles.info}>
              Si existe una cuenta con ese email, te enviamos un enlace para
              restablecer tu contraseña. Revisá tu bandeja (y el spam).
            </p>
            <p className={styles.switch}>
              <Link href="/login" className={styles.switchBtn}>
                Volver a iniciar sesión
              </Link>
            </p>
          </>
        ) : (
          <>
            <p className={styles.subtitle}>
              Ingresá tu email y te mandamos un enlace para crear una nueva
              contraseña.
            </p>

            {error && <p className={styles.error}>{error}</p>}

            <form className={styles.form} onSubmit={handleSubmit}>
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

              <button
                type="submit"
                disabled={loading}
                className={styles.primaryBtn}
              >
                {loading ? "Enviando..." : "Enviarme el enlace"}
              </button>
            </form>

            <p className={styles.switch}>
              <Link href="/login" className={styles.switchBtn}>
                Volver a iniciar sesión
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
