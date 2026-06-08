"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import styles from "./page.module.css";

const OWNER_EMAIL = "estani.lomonaco@gmail.com";

const ROLE_LABEL = {
  dev: "Dueño",
  admin: "Admin",
  user: "Cliente",
};

export default function AdminUsuariosPage() {
  const supabase = createClient();
  const { profile: meProfile } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    // Join profiles → auth.users vía un SELECT con la vista que armamos.
    // Como auth.users no es accesible vía RLS desde el cliente, usamos un RPC
    // o leemos solo profiles. Para esta versión leemos profiles (el email
    // viaja en profiles si el trigger lo guarda; sino lo derivamos del nombre).
    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, email, role, created_at")
      .order("created_at", { ascending: true });

    if (error) {
      setError(error.message);
      setRows([]);
    } else {
      setRows(data || []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  async function changeRole(userId, newRole) {
    setSavingId(userId);
    setError("");
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId);

    if (error) {
      setError(error.message);
    } else {
      setRows((rs) =>
        rs.map((r) => (r.id === userId ? { ...r, role: newRole } : r))
      );
    }
    setSavingId(null);
  }

  const filtered = rows.filter((r) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      (r.name || "").toLowerCase().includes(q) ||
      (r.email || "").toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Usuarios</h1>
        <p className={styles.pageSubtitle}>
          Asigná o revocá permisos de administrador. Solo el dueño del sitio puede acceder a esta pantalla.
        </p>
      </div>

      <div className={styles.toolbar}>
        <input
          type="text"
          placeholder="Buscar por nombre o email"
          className={styles.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className={styles.count}>
          {filtered.length} / {rows.length}
        </span>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className={styles.muted}>
                  Cargando...
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={4} className={styles.muted}>
                  Sin usuarios.
                </td>
              </tr>
            )}
            {!loading &&
              filtered.map((u) => {
                const isOwner = u.email === OWNER_EMAIL || u.role === "dev";
                const isMe = u.id === meProfile?.id;
                return (
                  <tr key={u.id}>
                    <td>{u.name || <span className={styles.muted}>(sin nombre)</span>}</td>
                    <td>{u.email || <span className={styles.muted}>—</span>}</td>
                    <td>
                      <span className={`${styles.badge} ${styles[`badge_${u.role}`]}`}>
                        {ROLE_LABEL[u.role] || u.role}
                      </span>
                    </td>
                    <td>
                      {isOwner ? (
                        <span className={styles.muted}>Dueño protegido</span>
                      ) : isMe ? (
                        <span className={styles.muted}>Sos vos</span>
                      ) : u.role === "admin" ? (
                        <button
                          className={styles.btnRevoke}
                          disabled={savingId === u.id}
                          onClick={() => changeRole(u.id, "user")}
                        >
                          {savingId === u.id ? "Guardando..." : "Revocar admin"}
                        </button>
                      ) : (
                        <button
                          className={styles.btnPromote}
                          disabled={savingId === u.id}
                          onClick={() => changeRole(u.id, "admin")}
                        >
                          {savingId === u.id ? "Guardando..." : "Hacer admin"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
