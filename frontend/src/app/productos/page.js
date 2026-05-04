import { Suspense } from "react";
import { findAllProducts, findAllCategories } from "@/lib/db/products";
import ProductsView from "./ProductsView";

export const metadata = {
  title: "Instrumentos | MusicTrack",
};

export default async function ProductsPage() {
  // Carga server-side de productos + categorías; ProductsView es Client.
  const products = await findAllProducts();
  const categories = await findAllCategories();

  return (
    <div className="container">
      <header style={{ marginBottom: "1.5rem" }}>
        <h1>Nuestros instrumentos</h1>
        <p className="text-muted">
          Filtra por categoria, buscalos por nombre y encontra tu proximo
          instrumento.
        </p>
      </header>

      <Suspense fallback={<p className="text-muted">Cargando...</p>}>
        <ProductsView products={products} categories={categories} />
      </Suspense>
    </div>
  );
}
