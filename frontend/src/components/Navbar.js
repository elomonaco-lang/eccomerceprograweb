"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { totalItems, hydrated } = useCart();
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand} onClick={closeMenu}>
          <span className={styles.logoMark} aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2.5C6.8 2.5 3 6 3 10c0 2.4 1.4 5.6 3.3 8.3 1 1.4 2.1 2.6 3.1 3.4.6.5 1.2.8 1.7.8h1.8c.5 0 1.1-.3 1.7-.8 1-.8 2.1-2 3.1-3.4 1.9-2.7 3.3-5.9 3.3-8.3 0-4-3.8-7.5-9-7.5zm0 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"
              />
            </svg>
          </span>
          <span className={styles.brandText}>MusicTrack</span>
        </Link>

        <button
          className={styles.menuBtn}
          aria-label="Abrir menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav
          className={`${styles.nav} ${open ? styles.navOpen : ""}`}
          onClick={closeMenu}
        >
          <Link href="/" className={styles.link}>
            Inicio
          </Link>
          <Link href="/productos" className={styles.link}>
            Productos
          </Link>
          <Link href="/carrito" className={`${styles.link} ${styles.cartLink}`}>
            Carrito
            {hydrated && totalItems > 0 && (
              <span className={styles.badge}>{totalItems}</span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
