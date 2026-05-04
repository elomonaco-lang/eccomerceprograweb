import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import { products, categories } from "@/data/products";
import styles from "./page.module.css";

export default function HomePage() {
  // Tomamos los primeros 4 productos como destacados.
  const featured = products.slice(0, 4);

  const benefits = [
    {
      title: "Cafe fresco",
      description: "Tueste reciente y empacado en capsula con barrera de aroma.",
      icon: "☕",
    },
    {
      title: "Envio rapido",
      description: "Recibi tus capsulas en 24/48 horas en todo el pais.",
      icon: "🚚",
    },
    {
      title: "100% compatibles",
      description: "Funcionan con cualquier maquina tipo Nespresso original.",
      icon: "✅",
    },
    {
      title: "Origenes seleccionados",
      description: "Cafes de Brasil, Colombia y Etiopia, mas blends italianos.",
      icon: "🌎",
    },
  ];

  return (
    <>
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroText}>
            <span className={styles.kicker}>Capsulas de cafe</span>
            <h1 className={styles.heroTitle}>
              Cafe de origen, en cada capsula
            </h1>
            <p className={styles.heroSubtitle}>
              Espressos intensos, tuestes suaves, descafeinados y saborizados.
              Compatibles con maquinas tipo Nespresso. Tueste reciente y envio a
              todo el pais.
            </p>
            <div className={styles.heroActions}>
              <Link href="/productos" className="btn btn-accent">
                Ver capsulas
              </Link>
              <Link href="#beneficios" className="btn btn-outline">
                Conocer mas
              </Link>
            </div>
          </div>
          <div className={styles.heroImage} aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1610632380989-680fe40816c6?w=1000&q=80"
              alt=""
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.sectionHead}>
            <h2 className="section-title">Productos destacados</h2>
            <Link href="/productos" className={styles.linkMore}>
              Ver todos →
            </Link>
          </div>
          <ProductGrid products={featured} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Categorias</h2>
          <div className={styles.categories}>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/productos?categoria=${encodeURIComponent(cat)}`}
                className={styles.categoryCard}
              >
                <span>{cat}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="beneficios">
        <div className="container">
          <h2 className="section-title">Por que elegirnos</h2>
          <div className={styles.benefits}>
            {benefits.map((b) => (
              <div key={b.title} className={styles.benefit}>
                <div className={styles.benefitIcon} aria-hidden="true">
                  {b.icon}
                </div>
                <h3 className={styles.benefitTitle}>{b.title}</h3>
                <p className={styles.benefitDesc}>{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
