"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/format";
import styles from "./page.module.css";

const STATUS_LABEL = {
  pending: "Pendiente",
  approved: "Aprobada",
  failed: "Rechazada",
  refunded: "Reembolsada",
};

const STATUS_CLASS = {
  pending: "statusPending",
  approved: "statusApproved",
  failed: "statusFailed",
  refunded: "statusRefunded",
};

function formatDate(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function PedidosPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(new Set());

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login?next=/pedidos");
  }, [authLoading, user, router]);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError("");

    // RLS ya restringe a las propias órdenes del user. No filtramos por user_id
    // en el cliente: si lo hiciéramos, igual cabe la verdad de Supabase.
    const { data: ordersData, error: ordersErr } = await supabase
      .from("orders")
      .select("id, order_code, total, status, payment_status, created_at")
      .order("created_at", { ascending: false });

    if (ordersErr) {
      setError(ordersErr.message);
      setLoading(false);
      return;
    }

    if (!ordersData || ordersData.length === 0) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const orderIds = ordersData.map((o) => o.id);
    const { data: itemsData, error: itemsErr } = await supabase
      .from("order_items")
      .select("order_id, product_name, unit_price, quantity, subtotal")
      .in("order_id", orderIds);

    if (itemsErr) {
      setError(itemsErr.message);
      setLoading(false);
      return;
    }

    const itemsByOrder = new Map();
    for (const it of itemsData || []) {
      if (!itemsByOrder.has(it.order_id)) itemsByOrder.set(it.order_id, []);
      itemsByOrder.get(it.order_id).push(it);
    }

    setOrders(
      ordersData.map((o) => ({
        ...o,
        items: itemsByOrder.get(o.id) || [],
      }))
    );
    setLoading(false);
  }, [supabase, user]);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  function toggle(id) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (authLoading || !user) {
    return (
      <div className="container">
        <p className="text-muted" style={{ padding: "3rem 0", textAlign: "center" }}>
          Cargando...
        </p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <h1 className={styles.title}>Mis pedidos</h1>
          <p className={styles.subtitle}>
            Historial de tus compras y el estado de cada una.
          </p>
        </header>

        {error && <div className={styles.error}>{error}</div>}

        {loading ? (
          <div className={styles.loadingState}>Cargando pedidos...</div>
        ) : orders.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 7h16l-1.5 11a2 2 0 0 1-2 1.8H7.5a2 2 0 0 1-2-1.8L4 7z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 7V5a3 3 0 0 1 6 0v2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2>Todavía no tenés pedidos</h2>
            <p className="text-muted">Cuando hagas tu primera compra, vas a verla acá.</p>
            <Link href="/productos" className="btn btn-accent" style={{ marginTop: "1rem" }}>
              Ver productos
            </Link>
          </div>
        ) : (
          <ul className={styles.orderList}>
            {orders.map((o) => {
              const isOpen = expanded.has(o.id);
              const statusKey = STATUS_LABEL[o.status] ? o.status : "pending";
              return (
                <li key={o.id} className={styles.orderCard}>
                  <button
                    type="button"
                    className={styles.orderHeader}
                    onClick={() => toggle(o.id)}
                    aria-expanded={isOpen}
                  >
                    <div className={styles.orderHeaderLeft}>
                      <div className={styles.orderCode}>{o.order_code}</div>
                      <div className={styles.orderDate}>{formatDate(o.created_at)}</div>
                    </div>
                    <div className={styles.orderHeaderRight}>
                      <span className={`${styles.badge} ${styles[STATUS_CLASS[statusKey]]}`}>
                        {STATUS_LABEL[statusKey]}
                      </span>
                      <span className={styles.orderTotal}>{formatPrice(o.total)}</span>
                      <svg
                        className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 6l4 4 4-4" />
                      </svg>
                    </div>
                  </button>
                  {isOpen && (
                    <div className={styles.orderBody}>
                      <h3 className={styles.itemsTitle}>Productos</h3>
                      <ul className={styles.itemsList}>
                        {o.items.length === 0 ? (
                          <li className="text-muted">Sin items registrados.</li>
                        ) : (
                          o.items.map((it, idx) => (
                            <li key={idx} className={styles.itemRow}>
                              <span className={styles.itemName}>
                                {it.product_name}{" "}
                                <span className="text-muted">×{it.quantity}</span>
                              </span>
                              <span className={styles.itemSubtotal}>
                                {formatPrice(it.subtotal)}
                              </span>
                            </li>
                          ))
                        )}
                      </ul>
                      {o.payment_status && (
                        <p className={styles.paymentInfo}>
                          Estado del pago: <strong>{o.payment_status}</strong>
                        </p>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
