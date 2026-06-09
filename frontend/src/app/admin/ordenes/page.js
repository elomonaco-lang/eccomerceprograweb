"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
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

const NEXT_STATUS = {
  pending: ["approved", "failed"],
  approved: ["refunded"],
  failed: ["pending"],
  refunded: [],
};

function formatDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("es-AR", {
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

export default function AdminOrdenesPage() {
  const supabase = createClient();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expanded, setExpanded] = useState(new Set());
  const [updatingId, setUpdatingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    // Como admin/dev, RLS deja leer TODAS las orders via orders_select_admin.
    const { data: ordersData, error: ordersErr } = await supabase
      .from("orders")
      .select(
        "id, order_code, user_id, customer_name, customer_email, customer_phone, total, status, payment_status, payment_id, payment_provider, created_at"
      )
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
    const { data: itemsData } = await supabase
      .from("order_items")
      .select("order_id, product_name, unit_price, quantity, subtotal")
      .in("order_id", orderIds);

    const itemsByOrder = new Map();
    for (const it of itemsData || []) {
      if (!itemsByOrder.has(it.order_id)) itemsByOrder.set(it.order_id, []);
      itemsByOrder.get(it.order_id).push(it);
    }

    setOrders(
      ordersData.map((o) => ({ ...o, items: itemsByOrder.get(o.id) || [] }))
    );
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const kpis = useMemo(() => {
    const total = orders.length;
    const approved = orders.filter((o) => o.status === "approved");
    const pending = orders.filter((o) => o.status === "pending").length;
    const sumApproved = approved.reduce((s, o) => s + (o.total || 0), 0);
    const avgTicket = approved.length
      ? Math.round(sumApproved / approved.length)
      : 0;
    return { total, sumApproved, avgTicket, pending };
  }, [orders]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (!q) return true;
      return (
        (o.order_code || "").toLowerCase().includes(q) ||
        (o.customer_email || "").toLowerCase().includes(q) ||
        (o.customer_name || "").toLowerCase().includes(q)
      );
    });
  }, [orders, statusFilter, search]);

  function toggle(id) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function changeStatus(orderId, newStatus) {
    setUpdatingId(orderId);
    setError("");
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      setError(error.message);
    } else {
      setOrders((os) =>
        os.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    }
    setUpdatingId(null);
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Órdenes</h1>
        <p className={styles.pageSubtitle}>
          Todas las compras del e-commerce. Cambiá el estado o revisá detalles.
        </p>
      </div>

      <div className={styles.kpiGrid}>
        <div className={`${styles.kpiCard} ${styles.kpi_primary}`}>
          <div className={styles.kpiLabel}>Total de órdenes</div>
          <div className={styles.kpiValue}>{kpis.total}</div>
          <div className={styles.kpiSub}>desde el inicio</div>
        </div>
        <div className={`${styles.kpiCard} ${styles.kpi_success}`}>
          <div className={styles.kpiLabel}>Ventas totales</div>
          <div className={styles.kpiValue}>{formatPrice(kpis.sumApproved)}</div>
          <div className={styles.kpiSub}>órdenes aprobadas</div>
        </div>
        <div className={`${styles.kpiCard} ${styles.kpi_accent}`}>
          <div className={styles.kpiLabel}>Ticket promedio</div>
          <div className={styles.kpiValue}>{formatPrice(kpis.avgTicket)}</div>
          <div className={styles.kpiSub}>por compra aprobada</div>
        </div>
        <div className={`${styles.kpiCard} ${styles.kpi_warning}`}>
          <div className={styles.kpiLabel}>Pendientes</div>
          <div className={styles.kpiValue}>{kpis.pending}</div>
          <div className={styles.kpiSub}>esperando confirmación</div>
        </div>
      </div>

      <div className={styles.toolbar}>
        <input
          type="text"
          placeholder="Buscar por código, email o nombre"
          className={styles.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={styles.select}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Todos los estados</option>
          <option value="pending">Pendientes</option>
          <option value="approved">Aprobadas</option>
          <option value="failed">Rechazadas</option>
          <option value="refunded">Reembolsadas</option>
        </select>
        <span className={styles.count}>
          {filtered.length} / {orders.length}
        </span>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th></th>
              <th>Código</th>
              <th>Cliente</th>
              <th>Estado</th>
              <th>Pago</th>
              <th className={styles.alignRight}>Total</th>
              <th>Fecha</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className={styles.empty}>
                  Cargando órdenes...
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={8} className={styles.empty}>
                  No hay órdenes para mostrar.
                </td>
              </tr>
            )}
            {!loading &&
              filtered.map((o) => {
                const statusKey = STATUS_LABEL[o.status] ? o.status : "pending";
                const isOpen = expanded.has(o.id);
                const nextStatuses = NEXT_STATUS[statusKey] || [];
                return (
                  <>
                    <tr key={o.id} className={styles.row}>
                      <td>
                        <button
                          type="button"
                          className={`${styles.chevronBtn} ${isOpen ? styles.chevronOpen : ""}`}
                          onClick={() => toggle(o.id)}
                          aria-label={isOpen ? "Cerrar detalle" : "Ver detalle"}
                        >
                          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M6 4l4 4-4 4" />
                          </svg>
                        </button>
                      </td>
                      <td className={styles.cellCode}>{o.order_code}</td>
                      <td>
                        <div className={styles.customerName}>{o.customer_name || "—"}</div>
                        <div className={styles.customerEmail}>{o.customer_email}</div>
                      </td>
                      <td>
                        <span className={`${styles.badge} ${styles[STATUS_CLASS[statusKey]]}`}>
                          {STATUS_LABEL[statusKey]}
                        </span>
                      </td>
                      <td className={styles.muted}>
                        {o.payment_status || "—"}
                      </td>
                      <td className={`${styles.cellTotal} ${styles.alignRight}`}>
                        {formatPrice(o.total)}
                      </td>
                      <td className={styles.muted}>{formatDate(o.created_at)}</td>
                      <td>
                        {nextStatuses.length > 0 && (
                          <select
                            className={styles.statusSelect}
                            value=""
                            disabled={updatingId === o.id}
                            onChange={(e) => {
                              if (e.target.value) changeStatus(o.id, e.target.value);
                            }}
                          >
                            <option value="">Cambiar estado…</option>
                            {nextStatuses.map((s) => (
                              <option key={s} value={s}>
                                Marcar {STATUS_LABEL[s].toLowerCase()}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                    </tr>
                    {isOpen && (
                      <tr className={styles.detailRow} key={`${o.id}-detail`}>
                        <td colSpan={8}>
                          <div className={styles.detailContent}>
                            <div className={styles.detailColumn}>
                              <h4>Cliente</h4>
                              <p>{o.customer_name}</p>
                              <p>{o.customer_email}</p>
                              {o.customer_phone && <p>{o.customer_phone}</p>}
                            </div>
                            <div className={styles.detailColumn}>
                              <h4>Pago</h4>
                              <p>
                                Proveedor: <strong>{o.payment_provider || "—"}</strong>
                              </p>
                              <p>
                                ID: <strong>{o.payment_id || "—"}</strong>
                              </p>
                              <p>
                                Estado: <strong>{o.payment_status || "—"}</strong>
                              </p>
                            </div>
                            <div className={styles.detailColumnWide}>
                              <h4>Productos ({o.items.length})</h4>
                              <ul className={styles.itemsList}>
                                {o.items.length === 0 ? (
                                  <li className={styles.muted}>Sin items.</li>
                                ) : (
                                  o.items.map((it, idx) => (
                                    <li key={idx} className={styles.itemRow}>
                                      <span>
                                        {it.product_name}{" "}
                                        <span className={styles.muted}>×{it.quantity}</span>
                                      </span>
                                      <span>{formatPrice(it.subtotal)}</span>
                                    </li>
                                  ))
                                )}
                              </ul>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
