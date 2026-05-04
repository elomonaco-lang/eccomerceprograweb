import { Suspense } from "react";
import ProductsView from "./ProductsView";

export const metadata = {
  title: "Capsulas | Origen",
};

export default function ProductsPage() {
  return (
    <div className="container">
      <header style={{ marginBottom: "1.5rem" }}>
        <h1>Nuestras capsulas</h1>
        <p className="text-muted">
          Filtra por intensidad, buscalas por nombre y elegi tu cafe ideal.
        </p>
      </header>

      <Suspense fallback={<p className="text-muted">Cargando...</p>}>
        <ProductsView />
      </Suspense>
    </div>
  );
}
