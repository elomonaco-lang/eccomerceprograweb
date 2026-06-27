// Componente Wallet Brick de MP — deep-linkea a la app si está instalada.
// v2: forzar rebuild sin cache.
"use client";

import { useEffect, useState } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";

// Singleton: el SDK solo se inicializa una vez por sesión.
let mpInitialized = false;

function initMpOnce() {
  if (mpInitialized) return;
  const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;
  if (!publicKey) {
    console.warn("[MP] NEXT_PUBLIC_MP_PUBLIC_KEY no configurada");
    return;
  }
  initMercadoPago(publicKey, { locale: "es-AR" });
  mpInitialized = true;
}

/**
 * Renderiza el botón Wallet de MP que deep-linkea a la app si está instalada.
 * El componente arranca creando la preference contra nuestro backend, después
 * monta el Brick con el preference_id devuelto.
 *
 * Props:
 *   - createPreference: () => Promise<{ preferenceId, orderId }>
 *       función que llama a /api/payments/mercadopago/create-preference y
 *       devuelve el id de la preference creada.
 *   - onReady?: () => void
 *   - onError?: (err) => void
 *   - onSubmit?: () => void  // cuando user clickea el Brick, antes del redirect
 */
export default function MercadoPagoBrick({
  createPreference,
  onReady,
  onError,
  onSubmit,
}) {
  const [preferenceId, setPreferenceId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    initMpOnce();
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { preferenceId } = await createPreference();
        if (!cancelled) setPreferenceId(preferenceId);
      } catch (err) {
        if (!cancelled) setError(err.message || "Error preparando el pago.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "1rem", color: "#888" }}>
        Preparando pago seguro…
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: "0.75rem 1rem",
          background: "rgba(192,57,43,0.1)",
          color: "#c0392b",
          borderRadius: 8,
          fontSize: "0.9rem",
        }}
        role="alert"
      >
        {error}
      </div>
    );
  }

  if (!preferenceId) return null;

  return (
    <Wallet
      initialization={{
        preferenceId,
        redirectMode: "self",
      }}
      customization={{
        texts: { valueProp: "smart_option" },
        visual: {
          buttonBackground: "default",
          borderRadius: "8px",
          verticalPadding: "16px",
          horizontalPadding: "24px",
        },
      }}
      onReady={onReady}
      onError={(err) => {
        console.error("[MP Brick] error:", err);
        if (onError) onError(err);
      }}
      onSubmit={() => {
        if (onSubmit) onSubmit();
      }}
    />
  );
}
